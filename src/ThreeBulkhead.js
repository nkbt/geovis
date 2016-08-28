import React from 'react';
import {connect} from 'react-redux';
import {run} from './three';


export const ThreeBulkheadContent = React.createClass({
  propTypes: {
    attacks: React.PropTypes.objectOf(React.PropTypes.shape({
      srcLat: React.PropTypes.number.isRequired,
      srcLon: React.PropTypes.number.isRequired,
      dstLat: React.PropTypes.number.isRequired,
      dstLon: React.PropTypes.number.isRequired,
      value: React.PropTypes.number.isRequired
    })).isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },


  componentWillMount() {
    this.ref = null;
  },


  componentDidMount() {
    if (this.ref) {
      const {width, height, attacks} = this.props;
      const {onResize, onData} = run({canvas: this.ref, width, height});
      this.onResize = onResize;
      this.onData = onData;

      onData(attacks);
    }
  },


  componentWillReceiveProps({width, height, attacks}) {
    if (!this.ref) {
      return;
    }

    if (this.onResize &&
      width !== this.props.width &&
      height !== this.props.height) {
      this.onResize({width, height});
    }

    if (this.onData &&
      attacks !== this.props.attacks) {
      this.onData(attacks);
    }
  },


  shouldComponentUpdate() {
    return false;
  },


  onRef(ref) {
    this.ref = ref;
  },


  render() {
    return <canvas ref={this.onRef} />;
  }
});


export const ThreeBulkhead = connect(({attacks}) => ({attacks}))(ThreeBulkheadContent);
