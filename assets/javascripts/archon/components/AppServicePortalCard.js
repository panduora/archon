import React from 'react';
import Radium from 'radium';

import Mdl from './MdlComponents';
import ProcRuntimeSection from './ProcRuntimeSection';
import ProcSpecSection from './ProcSpecSection';

const {Card, CardTitle, CardMenuIcon, CardActions} = Mdl;

let AppServicePortalCard = React.createClass({
  
  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {app, portal, service} = this.props;
    const lifescore = portal.lifescore();
    const titleStyle = _.assign({}, this.styles.cardTitle, theme.colorStyle('service', true));
    return (
      <Card style={theme.card}>
        <CardTitle style={titleStyle} title={`Service[${service.appname}] Portal - ${portal.procname}`} />
        <div style={{ padding: '16px 0' }}>
          <ProcRuntimeSection proc={portal} fullname={app.procFullname(portal)} />
          <ProcSpecSection proc={portal} />
        </div>
        { this.renderMenuIcon(app, portal, theme, lifescore) }
        <CardActions 
          buttons={[
            { title: '服务详情', to: `/archon/apps/${service.appname}`, color: 'colored' },
            { title: 'Portal详情', to: `/archon/apps/${app.appname}/portal/${portal.procname}`, color: 'colored' },
          ]}
          border align='right' />
      </Card>
    );
  },

  renderMenuIcon(app, proc, theme, lifescore) {
    if (lifescore === 100) {
      return ( 
        <CardMenuIcon style={{ color: 'white' }} icon='open_in_new'
          to={`/archon/apps/${app.appname}/portal/${proc.procname}`} />
      );
    } else {
      return (
        <CardMenuIcon style={theme.colorStyle('error')} icon='warning'
          to={`/archon/apps/${app.appname}/portal/${proc.procname}`} />
      );
    }
  },

  styles: {
    cardTitle: {
      height: 56,
      color: 'white',
    },
  },

});

export default Radium(AppServicePortalCard);
