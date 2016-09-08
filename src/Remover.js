import React from 'react';
import {shouldComponentUpdate} from 'react/lib/ReactComponentWithPureRenderMixin';
import {connect} from 'react-redux';
import {ATTACKS_REMOVE} from './attacks/reducer';
import {differ} from './lib/differ';


const RemoverContent = React.createClass({
  propTypes: {
    attacks: React.PropTypes.object.isRequired,
    onRemove: React.PropTypes.func.isRequired
  },


  componentWillMount() {
    this.timers = {};
    this.diff = differ(this.timers);
  },


  componentDidMount() {
    const {attacks} = this.props;
    const {add} = this.diff(attacks);
    add.forEach(this.setTimeout);
  },


  componentWillReceiveProps({attacks}) {
    const {add} = this.diff(attacks);
    add.forEach(this.setTimeout);

    // safeguard, no more then 20 attacks at once
    const MAX = 20;
    const ids = Object.keys(attacks);
    ids.slice(0, ids.length - Math.min(MAX, ids.length)).forEach(this.onRemove);
  },


  shouldComponentUpdate,


  componentWillUnmount() {
    Object.keys(this.timers)
      .forEach(id => clearTimeout(this.timers[id]));
  },


  setTimeout(id) {
    clearTimeout(this.timers[id]);
    this.timers[id] = setTimeout(() => this.onRemove(id), 3000);
  },


  onRemove(id) {
    const {onRemove} = this.props;
    clearTimeout(this.timers[id]);
    delete this.timers[id];
    onRemove(id);
  },


  render() {
    return false;
  }
});


const mapStateToProps = ({
  attacks
}) => ({
  attacks
});


const mapDispatchToProps = dispatch => ({
  onRemove: id => dispatch({type: ATTACKS_REMOVE, ids: [id]})
});


export const Remover = connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoverContent);
