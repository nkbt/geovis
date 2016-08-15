import React from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import {run} from './three';


export const GeoVis = React.createClass({
  propTypes: {},


  componentWillMount() {
    this.ref = null;
  },


  componentDidMount() {
    if (this.ref) {
      run({canvas: this.ref});
    }
  },


  shouldComponentUpdate,


  onRef(ref) {
    this.ref = ref;
  },


  render() {
    return <canvas ref={this.onRef} />;
  }
});
