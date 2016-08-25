import React from 'react';
import {run} from './d3';
import css from './Timeline.css';


export const Timeline = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired
  },


  componentWillMount() {
    this.ref = null;
  },


  componentDidMount() {
    if (this.ref) {
      const {width} = this.props;
      const {onResize} = run({element: this.ref, width, height: 50});
      this.onResize = onResize;
    }
  },


  componentWillReceiveProps({width}) {
    if (this.ref && this.onResize) {
      this.onResize({width, height: 50});
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
