import React from 'react';

import * as AppActions from '../models/actions/Apps';
import Mdl from '../components/MdlComponents';
import CreateAppCard from '../components/CreateAppCard';
import AppSummaryCard from '../components/AppSummaryCard';
import LoadHud from '../components/LoadHud';
import NoticeInforCard from '../components/NoticeInforCard';
import AppStatCard from '../components/AppStatCard';
import AppServerStatCard from '../components/AppServerStatCard';
import AuthorizeMixin from '../mixins/AuthorizeMixin';
import FlashMessageMixin from '../mixins/FlashMessageMixin';
import ApiMixin from '../mixins/ApiMixin';
import AppView from '../models/views/App';

const {Grid, GridCell} = Mdl;

let AppListPage = React.createClass({

  mixins: [AuthorizeMixin, FlashMessageMixin, ApiMixin],

  refreshList() {
    const {dispatch} = this.props;
    dispatch(AppActions.list());
  },

  componentDidMount() {
    this.authorize(() => {
      this.refreshList();
    });
  },

  render() {
    const request = this.getRequest('LOAD_APPS_REQUEST');
    const delRequest = this.getRequest('DELETE_APP_REQUEST');
    const apps = this.sortApps(request);
    return (
      <Grid>
        { this.renderFlash(delRequest.opFlash, AppActions.resetApiFlash('DELETE_APP_REQUEST')) }
        { this.renderError(request) }
        { this.renderNoApps(apps, request) }

        { this.renderAppColumns(apps, request, 2, 1) }
        { this.renderAppColumns(apps, request, 2, 2) }

        { !request.isFetching ? null : <GridCell col={8} /> }

        <GridCell col={4}>
          <CreateAppCard />
          <AppStatCard apps={apps} />
          <AppServerStatCard apps={apps} />
        </GridCell>
        { request.isFetching ? <LoadHud /> : null }
      </Grid>    
    );
  },

  renderAppColumns(apps, request, totalColumn, column) {
    if (request.isFetching || request.error ) { return null; }
    if (!apps || apps.length === 0) { return null; }
    return (
      <GridCell col={4}>
        { 
          apps.map((app, index) => {
            return index % totalColumn === (column - 1) ? <AppSummaryCard app={app} key={index} /> : null;
          })
        }
      </GridCell>
    );
  },

  renderNoApps(apps, request) {
    if (request.isFetching || request.error) {
      return null;
    }
    if (apps && apps.length > 0) {
      return null;
    } 
    return (
      <GridCell col={8}>
        <NoticeInforCard title='还没有部署应用呢' 
          noticeType='info'
          message='您还有部署相关应用，您可以通过右侧添加应用输入框来试着部署第一个应用吧～' />
      </GridCell>
    );
  },

  renderError(request) {
    if (request.isFetching || !request.error) {
      return null;
    }
    return (
      <GridCell col={8}>
        <NoticeInforCard title='请求出错了' 
          buttons={[
            { title: '刷新', onClick: (evt) => { this.refreshList() } },
          ]}
          noticeType='error'
          message={`请求应用列表失败：${request.error}`} />
      </GridCell>
    );
  },

  sortApps(request) {
    if (request.statusCode !== 200) return [];
    const items = request.data;
    return _(items).keys().map(k => items[k]).
      sort((x, y) => {
        let xa = AppView(x);
        let ya = AppView(y);
        let scorex = xa.lifescore();
        let scorey = ya.lifescore();
        if (scorex !== scorey) {
          return scorex - scorey;
        }
        return ya.commitTime().unix() - xa.commitTime().unix();
      }).map(app => AppView(app)).value();
  },

});

export default AppListPage;
