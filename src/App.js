import React from 'react';
import {ReactElementResize} from 'react-element-resize';
import {connect} from 'react-redux';
import {Globe} from './Globe';
import {Controls} from './Controls';
import {Remover} from './Remover';
import {Adder} from './Adder';
import {STATE_PLAYING} from './controls/reducer';


import css from './App.css';


const noop = () => null;


const ExtrasContent = ({controls}) => (
  <div>
    {controls === STATE_PLAYING ? <Adder /> : null}
    {controls === STATE_PLAYING ? <Remover /> : null}
  </div>
);
ExtrasContent.propTypes = {
  controls: React.PropTypes.string.isRequired
};

const mapStateToProps = ({
  controls
}) => ({
  controls
});

const Extras = connect(mapStateToProps)(ExtrasContent);


const GlobeWrapper = ({width, height}) => (width > 0 && height > 0) ? (
  <div className={css.app}>
    <Globe height={height} width={width} />
    <Controls />
    <Extras />
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
