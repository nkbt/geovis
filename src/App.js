import React from 'react';
import {ReactElementResize} from 'react-element-resize';
import {connect} from 'react-redux';
import {themr} from 'react-css-themr';
import {Globe} from './Globe';
import {Controls} from './Controls';
import {Remover} from './Remover';
import {Adder} from './Adder';
import {STATE_PLAYING} from './controls/reducer';


const css = {
  appContainer: 'GeoVis--App--container',
  appContent: 'GeoVis--App--content'
};


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

const AppContent = React.createClass({
  propTypes: {
    theme: React.PropTypes.object
  },


  shouldComponentUpdate() {
    return false;
  },


  render() {
    const {theme} = this.props;

    return (
      <ReactElementResize
        className={theme.appContainer}
        debounceTimeout={50}
        onResize={noop}>
        {({width, height}) => (
          (width > 0 && height > 0) ? (
            <div className={theme.appContent}>
              <Globe height={height} width={width} />
              <Controls theme={theme} />
              <Extras />
            </div>
          ) : null
        )}
      </ReactElementResize>
    );
  }
});


export const App = themr('ThemedApp', css)(AppContent);
