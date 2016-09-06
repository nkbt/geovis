import React from 'react';
import {shouldComponentUpdate} from 'react/lib/ReactComponentWithPureRenderMixin';
import {connect} from 'react-redux';
import {themr} from 'react-css-themr';
import {ATTACKS_ADD_RANDOM, ATTACKS_CLEAR} from './attacks/reducer';
import {
  STATE_PAUSED,
  STATE_PLAYING,
  CONTROLS_PLAY,
  CONTROLS_PAUSE
} from './controls/reducer';


const css = {
  controlsContainer: 'GeoVis--Controls--container',
  controlsOpened: 'GeoVis--Controls--opened',
  controlsContent: 'GeoVis--Controls--content',
  controlsToggle: 'GeoVis--Controls--toggle'
};


const ControlsContent = React.createClass({
  propTypes: {
    theme: React.PropTypes.object,
    controls: React.PropTypes.string.isRequired,
    onAdd: React.PropTypes.func.isRequired,
    onClear: React.PropTypes.func.isRequired,
    onPlay: React.PropTypes.func.isRequired,
    onPause: React.PropTypes.func.isRequired
  },


  getInitialState() {
    return {isOpened: false};
  },


  shouldComponentUpdate,


  onToggle(event) {
    event.preventDefault();
    this.setState({isOpened: !this.state.isOpened});
  },


  render() {
    const {theme, controls, onAdd, onClear, onPlay, onPause} = this.props;
    const {isOpened} = this.state;

    return (
      <div className={`${theme.controlsContainer} ${isOpened ? theme.controlsOpened : ''}`}>
        <div className={theme.controlsContent}>
          <span className={theme.controlsToggle} onClick={this.onToggle}>
            {isOpened ? '>' : '<'}
          </span>
          {controls === STATE_PLAYING ? <button onClick={onPause}>Pause</button> : null}
          {controls === STATE_PAUSED ? <button onClick={onPlay}>Play</button> : null}
          <button onClick={onAdd}>Add</button>
          <button onClick={onClear}>Clear</button>
        </div>
      </div>
    );
  }
});


const mapStateToProps = ({
  controls
}) => ({
  controls
});


const mapDispatchToProps = dispatch => ({
  onAdd: () => dispatch({type: ATTACKS_ADD_RANDOM}),
  onClear: () => dispatch({type: ATTACKS_CLEAR}),
  onPause: () => dispatch({type: CONTROLS_PAUSE}),
  onPlay: () => dispatch({type: CONTROLS_PLAY})
});


const ThemedControls = themr('ThemedControls', css)(ControlsContent);


export const Controls = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemedControls);
