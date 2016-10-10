package main

import (
	"bytes"
	"flag"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

const (
	kTemplateFile = "templates/archon.html"
	kAssetPrefix  = "public"
	kTargetFile   = "archon.html"
)

func main() {
	var web, mode string
	var apiServer string
	var ssoServer string
	var ssoClientId int
	flag.StringVar(&web, "web", ":9000", "Static file server address")
	flag.StringVar(&mode, "mode", "compile", "Compile mode or local debug mode")
	flag.StringVar(&apiServer, "api-server", "", "Specify the api server")
	flag.StringVar(&ssoServer, "sso-server", "", "Specify the sso server")
	flag.IntVar(&ssoClientId, "sso-client-id", -1, "Specify the sso client id")
	flag.Parse()

	if apiServer == "" {
		log.Fatalf("Please tell me the api server to call.")
	}
	if ssoServer == "" {
		log.Fatalf("Please tell me the sso server to call.")
	}
	if ssoClientId == -1 {
		log.Fatalf("Please tell me the sso client id.")
	}

	tmpl := template.New("archon.html").Funcs(getTemplateFuncMap())
	tmpl, err := tmpl.ParseFiles(kTemplateFile)
	if err != nil {
		log.Fatalf("Failed to parse the template file: %q, err = %s", kTemplateFile, err)
	}
	buffer := new(bytes.Buffer)
	binding := map[string]interface{}{
		"ApiServer":   apiServer,
		"SsoServer":   ssoServer,
		"SsoClientId": ssoClientId,
	}
	if err := tmpl.Execute(buffer, binding); err != nil {
		log.Fatalf("Failed to execute the template, err=%s, binding=%+v", err, binding)
	}
	if err := ioutil.WriteFile(kTargetFile, buffer.Bytes(), 0644); err != nil {
		log.Fatalf("Failed to write to the %q, err=%s", kTargetFile, err)
	}
	log.Printf("Template has been compiled: %q", kTargetFile)

	if mode != "compile" {
		fs := http.FileServer(http.Dir("."))
		http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			if strings.HasPrefix(r.URL.Path, "/archon") {
				http.ServeFile(w, r, "archon.html")
			} else if r.URL.Path == "/" {
				http.Redirect(w, r, "/archon", http.StatusMovedPermanently)
			} else {
				fs.ServeHTTP(w, r)
			}
		})
		log.Printf("Listening to %s ...", web)
		log.Fatal(http.ListenAndServe(web, nil))
	}
}

func getReverseProxy(proxyServer string) *httputil.ReverseProxy {
	if remote, err := url.Parse(proxyServer); err != nil {
		log.Fatalf("Failed to parse the proxy server url, %s", err)
		return nil
	} else {
		director := func(r *http.Request) {
			r.URL.Scheme = remote.Scheme
			r.URL.Host = remote.Host
			r.URL.Path = singleJoiningSlash(remote.Path, r.URL.Path)
			r.Host = remote.Host
			r.Header.Set("Host", remote.Host)
		}
		return &httputil.ReverseProxy{
			Director: director,
		}
	}
}

func singleJoiningSlash(a, b string) string {
	aslash := strings.HasSuffix(a, "/")
	bslash := strings.HasPrefix(b, "/")
	switch {
	case aslash && bslash:
		return a + b[1:]
	case !aslash && !bslash:
		return a + "/" + b
	}
	return a + b
}

func getTemplateFuncMap() template.FuncMap {
	return template.FuncMap{
		"assets": func(path string) (string, error) {
			if asset, ok := allAssetsMapping[path]; !ok {
				return "", fmt.Errorf("Cannot find asset %q", path)
			} else {
				return fmt.Sprintf("/%s/%s", kAssetPrefix, asset), nil
			}
		},
	}
}
