import React from 'react';
import {run} from './d3';
import css from './Timeline.css';


export const Timeline = React.createClass({
  propTypes: {},


  componentWillMount() {
    this.ref = null;
  },


  componentDidMount() {
    if (this.ref) {
      run({element: this.ref});
    }
  },


  shouldComponentUpdate() {
    return false;
  },


  onRef(ref) {
    this.ref = ref;
  },


  render() {
    return <div className={css.container} ref={this.onRef} />;
  }
});
