import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import MDL from './MdlComponents';
import Dialog from './Dialog';

let ProcRuntimeSection = React.createClass({

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {proc, fullname} = this.props;
    return (
      <div style={{ marginBottom: 16 }}>
        <h6 style={{ padding: '0 16px', margin: '8px 0 0' }}>{`运行时状况 [Up/Total = ${proc.upCount()}/${proc.numinstances}]`}</h6>
        <MDL.Table style={theme.dataTable}
          cols={[
            { title: '容器ID', number: false },
            { title: '容器名称', number: false },
            { title: '节点IP', number: false },
            { title: '容器IP', number: false },
            { title: '容器端口', number: true },
            { title: '环境变量', number: false },
          ]}
          rows={ _.map(proc.pods, (pod) => [pod.containerid.substring(0, 12), pod.containername, pod.nodeip, pod.containerip, pod.containerport, '点击查看']) }
          trStyle={(section, index) => {
            if (section === 'head') return {};
            return theme.colorStyle(proc.pods[index].status === 'True' ? 'success' : 'error');
          }}
          tdClickable={ (rowIndex, colIndex) => {
            if (colIndex !== 5) return null;
            return (evt) => this.showPodEnvDialog(proc.pods[rowIndex]);
          }} />
      </div>
    );
  },

  showPodEnvDialog(showPod) {
    const mountNode = document.getElementById('dialog');
    const {fullname, proc} = this.props;
    const dialog = (
      <Dialog title={`运行时环境变量`}
          buttons={[
            { title: '好的' },
          ]}>
        <p>下面列出 <b>{`proc - ${fullname}`}</b> 运行时环境变量。</p>
        <ul style={{ fontSize: 13 }}>
          {
            showPod.envs.map((env, index) => {
              return <li key={`${index}`}>{env}</li>
            })
          }
        </ul>
      </Dialog>
    ); 
    ReactDOM.render(dialog, mountNode);
  },

});

export default Radium(ProcRuntimeSection);
