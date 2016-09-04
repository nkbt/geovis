import React from 'react';
import {shouldComponentUpdate} from 'react/lib/ReactComponentWithPureRenderMixin';
import {connect} from 'react-redux';
import ReactInterval from 'react-interval';
import {ATTACKS_ADD_RANDOM} from './attacks/reducer';


const AdderContent = React.createClass({
  propTypes: {
    timeout: React.PropTypes.number,
    probability: React.PropTypes.number,
    onAdd: React.PropTypes.func.isRequired
  },


  getDefaultProps() {
    return {
      timeout: 700,
      probability: 0.3
    };
  },


  shouldComponentUpdate,


  add() {
    const {probability, onAdd} = this.props;
    if (Math.random() <= probability) {
      onAdd();
    }
  },


  render() {
    const {timeout} = this.props;
    return (
      <ReactInterval
        enabled={true}
        timeout={timeout}
        callback={this.add} />
    );
  }
});


const mapDispatchToProps = dispatch => ({
  onAdd: () => dispatch({type: ATTACKS_ADD_RANDOM})
});


export const Adder = connect(
  null,
  mapDispatchToProps
)(AdderContent);
