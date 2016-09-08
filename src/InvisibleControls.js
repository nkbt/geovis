import React from 'react';
import {shouldComponentUpdate} from 'react/lib/ReactComponentWithPureRenderMixin';
import {connect} from 'react-redux';
import {themr} from 'react-css-themr';
import {ATTACKS_ADD_RANDOM, ATTACKS_CLEAR} from './attacks/reducer';


const css = {
  invisibleControlsContainer: 'GeoVis--InvisibleControls--container',
  invisibleControlsOpened: 'GeoVis--InvisibleControls--opened',
  invisibleControlsContent: 'GeoVis--InvisibleControls--content',
  invisibleControlsToggle: 'GeoVis--InvisibleControls--toggle',
  invisibleControlsButton: 'GeoVis--InvisibleControls--button'
};


const InvisibleControlsContent = React.createClass({
  propTypes: {
    theme: React.PropTypes.object,
    onAdd: React.PropTypes.func.isRequired,
    onClear: React.PropTypes.func.isRequired
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
    const {theme, onAdd, onClear} = this.props;
    const {isOpened} = this.state;

    return (
      <div className={
        `${theme.invisibleControlsContainer} ${isOpened ? theme.invisibleControlsOpened : ''}`
      }>
        <div className={theme.invisibleControlsContent}>
          <span className={theme.invisibleControlsToggle} onClick={this.onToggle} />
          <button className={theme.invisibleControlsButton} onClick={onAdd}>Add</button>
          <button className={theme.invisibleControlsButton} onClick={onClear}>Clear</button>
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
  onClear: () => dispatch({type: ATTACKS_CLEAR})
});


const ThemedInvisibleControls = themr('ThemedInvisibleControls', css)(InvisibleControlsContent);


export const InvisibleControls = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemedInvisibleControls);
