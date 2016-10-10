import React from 'react';
import Radium from 'radium';
import MDL from './MdlComponents';

let ProcScheduleSpecCard = React.createClass({
  
  getInitialState() {
    return {
      isCpuValid: true,
      isMemoryValid: true,
    };
  },

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {cpu, memory} = this.props;
    const titleStyle = _.assign({}, theme.cardTitle, theme.colorStyle('info', true));
    return (
      <MDL.Card style={theme.card}>
        <MDL.CardTitle style={titleStyle} title={`运行资源调度`} />
        <MDL.CardSupportText>
          对Proc进行实时的动态运行CPU、内存等资源调整调度，输入需要的运行资源，点击确认调度即可。<br />
          目前预留内存：<b>{cpu}</b>，预留内存：<b>{memory}</b>
        </MDL.CardSupportText>
        <div style={{ padding: '0 16px' }}>
          <MDL.InputTextField inputType='number' name='cpu' ref='cpu'
            style={{ width: '100%' }}
            isValid={this.state.isCpuValid}
            onEnterPressed={this.doSchedule}
            label='预留CPU [0-32]' />
          <MDL.InputTextField inputType='text' name='memory' ref='memory'
            style={{ width: '100%' }}
            isValid={this.state.isMemoryValid}
            onEnterPressed={this.doSchedule}
            label='预留内存 [例如，32M]' />
        </div>
        <MDL.CardActions
          buttons={[
            { title: '确认调度', color: 'accent', onClick: this.doSchedule },
          ]}
          border={false} align='right' />
      </MDL.Card>
    );
  },

  doSchedule() {
    const cpuValue = this.refs.cpu.getValue();
    const memoryValue = this.refs.memory.getValue();
    let numCpu = this.props.cpu;
    let isCpuValid = true;
    let isMemoryValid = true;
    if (!cpuValue) {
      isCpuValid = false;
    } else {
      numCpu = Number(cpuValue);
      if (isNaN(numCpu) || numCpu < 0 || numCpu > 32) {
        isCpuValid = false;
      }
    }
    if (!memoryValue) {
      isMemoryValid = false;
    }
    this.setState({isCpuValid, isMemoryValid});
    if (isCpuValid && isMemoryValid) {
      this.props.doSchedule && this.props.doSchedule(numCpu, memoryValue); 
    }
  },

});

export default Radium(ProcScheduleSpecCard);
