import React from 'react';
import {shouldComponentUpdate} from 'react/lib/ReactComponentWithPureRenderMixin';
import {connect} from 'react-redux';
import {themr} from 'react-css-themr';
import {
  STATE_PAUSED,
  STATE_PLAYING,
  CONTROLS_PLAY,
  CONTROLS_PAUSE
} from './controls/reducer';


const css = {
  controlsContainer: 'GeoVis--Controls--container',
  controlsContent: 'GeoVis--Controls--content',
  controlsButton: 'GeoVis--Controls--button'
};


const ControlsContent = React.createClass({
  propTypes: {
    theme: React.PropTypes.object,
    controls: React.PropTypes.string.isRequired,
    onPlay: React.PropTypes.func.isRequired,
    onPause: React.PropTypes.func.isRequired
  },


  shouldComponentUpdate,


  render() {
    const {theme, controls, onPlay, onPause} = this.props;

    return (
      <div className={theme.controlsContainer}>
        <div className={theme.controlsContent}>
          {controls === STATE_PLAYING ?
            <button className={theme.controlsButton} onClick={onPause}>Pause</button> : null}
          {controls === STATE_PAUSED ?
            <button className={theme.controlsButton} onClick={onPlay}>Play</button> : null}
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
  onPause: () => dispatch({type: CONTROLS_PAUSE}),
  onPlay: () => dispatch({type: CONTROLS_PLAY})
});


const ThemedControls = themr('ThemedControls', css)(ControlsContent);


export const Controls = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemedControls);
