import React from 'react';
import AuthorizeMixin from '../mixins/AuthorizeMixin';
import TerminalCard from '../components/TerminalCard'

let ContainerTerminalPage = React.createClass({
    mixins: [AuthorizeMixin],

    render() {
        return <TerminalCard appName={this.props.params.appName} procName={this.props.params.procName} instanceNo={this.props.params.instanceNo}/>
    },

});

export default ContainerTerminalPage;
