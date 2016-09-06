import React from 'react';
import {shouldComponentUpdate} from 'react/lib/ReactComponentWithPureRenderMixin';
import {connect} from 'react-redux';
import {ATTACKS_ADD_RANDOM, ATTACKS_CLEAR} from './attacks/reducer';
import {
  STATE_PAUSED,
  STATE_PLAYING,
  CONTROLS_PLAY,
  CONTROLS_PAUSE
} from './controls/reducer';


import css from './static/Controls.css';


const ControlsContent = React.createClass({
  propTypes: {
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
    const {controls, onAdd, onClear, onPlay, onPause} = this.props;
    const {isOpened} = this.state;

    return (
      <div className={`${css.container} ${isOpened ? css.opened : ''}`}>
        <div className={css.content}>
          <span className={css.toggle} onClick={this.onToggle}>
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


export const Controls = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlsContent);
