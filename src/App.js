import React from 'react';
import {ReactElementResize} from 'react-element-resize';
import {Globe} from './Globe';


import css from './App.css';


const noop = () => null;


const GlobeWrapper = ({width, height}) => (width > 0 && height > 0) ? (
  <div className={css.app}>
    <Globe height={height} width={width} />
  </div>
) : null;
GlobeWrapper.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired
};


export const App = React.createClass({
  shouldComponentUpdate() {
    return false;
  },


  render() {
    return (
      <ReactElementResize
        className={css.app}
        debounceTimeout={50}
        onResize={noop}
        style={{position: 'fixed'}}>
        {GlobeWrapper}
      </ReactElementResize>
    );
  }
});
