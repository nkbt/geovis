import React from 'react';
import {run} from './three';


export const GeoVis = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },


  componentWillMount() {
    this.ref = null;
  },


  shouldComponentUpdate() {
    return false;
  },


  componentDidMount() {
    if (this.ref) {
      const {width, height} = this.props;
      console.log(`{width, height}`, {width, height})
      const {onResize} = run({canvas: this.ref, width, height});
      this.onResize = onResize;
    }
  },


  componentWillReceiveProps({width, height}) {
    if (this.ref && this.onResize) {
      this.onResize({width, height});
    }
  },


  onRef(ref) {
    this.ref = ref;
  },


  render() {
    return <canvas ref={this.onRef} />;
  }
});
