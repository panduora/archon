import React from 'react';
import {Link} from 'react-router';
import Radium from 'radium';

import MDL from './MdlComponents';
import ProcRuntimeSection from './ProcRuntimeSection';
import ProcSpecSection from './ProcSpecSection';

let AppProcDetailCard = React.createClass({

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {app, proc, procOpHandler} = this.props;
    const lifescore = proc.lifescore();
    const titleStyle = _.assign({}, this.styles.cardTitle, theme.colorStyle('proc', true));
    return (
      <MDL.Card depth={2} style={theme.card}>
        <MDL.CardTitle style={titleStyle} title={`Proc - ${app.procFullname(proc)}`} />
        <div style={{ padding: '16px 0' }}>
          <ProcRuntimeSection proc={proc} fullname={app.procFullname(proc)} procOpHandler={this.operateProc} />
          <ProcSpecSection proc={proc} />
        </div>
        { this.renderMenuIcon(app, proc, theme, lifescore) }
        <MDL.CardActions 
          buttons={[
            { title: '管理', icon: 'settings', to: `/archon/apps/${app.appname}/proc/${proc.procname}`, color: 'colored' },
          ]}
          border={true} align='right' />
      </MDL.Card>
    );
  },

  renderMenuIcon(app, proc, theme, lifescore) {
    if (lifescore === 100) {
      return ( 
        <MDL.CardMenuIcon style={{ color: 'white' }} icon='settings'
          to={`/archon/apps/${app.appname}/proc/${proc.procname}`} />
      );
    } else {
      return ( 
        <MDL.CardMenuIcon style={theme.colorStyle('error')} icon='warning'
          to={`/archon/apps/${app.appname}/proc/${proc.procname}`} />
      );
    }
  },

  operateProc(instance, operation) {
    const {proc, procOpHandler} = this.props;
    procOpHandler(proc.procname, instance, operation)
  }

  styles: {
    cardTitle: {
      height: 56,
      color: 'white',
    },
  },

});

export default Radium(AppProcDetailCard);
