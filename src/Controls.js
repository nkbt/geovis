import React from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {ATTACKS_ADD_RANDOM} from './attacks/reducer';


import css from './Controls.css';


const ControlsContent = React.createClass({
  propTypes: {},


  shouldComponentUpdate,


  render() {
    const {onAdd} = this.props;

    return (
      <div className={css.container}>
        <div className={css.content}>
          <button onClick={onAdd}>Add</button>
        </div>

      </div>
    );
  }
});


const mapStateToProps = () => ({});


const mapDispatchToProps = dispatch => ({
  onAdd: () => dispatch({type: ATTACKS_ADD_RANDOM})
});


export const Controls = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlsContent);
