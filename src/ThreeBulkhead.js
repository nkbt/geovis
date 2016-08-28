import React from 'react';
import {run} from './three';


export const ThreeBulkhead = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },


  componentWillMount() {
    this.ref = null;
  },


  componentDidMount() {
    if (this.ref) {
      const {width, height} = this.props;
      const {onResize} = run({canvas: this.ref, width, height});
      this.onResize = onResize;
    }
  },


  componentWillReceiveProps({width, height}) {
    if (this.ref && this.onResize) {
      this.onResize({width, height});
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
