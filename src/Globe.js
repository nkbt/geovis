import React from 'react';
import {shouldComponentUpdate} from 'react/lib/ReactComponentWithPureRenderMixin';
import {connect} from 'react-redux';
import {ReactBulkhead} from 'react-bulkhead';
import {onCreate} from './lib/three';


const onCountrySelect = cc => console.log('SELECT', cc);
const onCountryDeselect = cc => console.log('DESELECT', cc);

const GlobeContent = React.createClass({
  propTypes: {
    attacks: React.PropTypes.objectOf(React.PropTypes.shape({
      srcLat: React.PropTypes.number.isRequired,
      srcLon: React.PropTypes.number.isRequired,
      dstLat: React.PropTypes.number.isRequired,
      dstLon: React.PropTypes.number.isRequired,
      color: React.PropTypes.number,
      value: React.PropTypes.number.isRequired
    })).isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },


  shouldComponentUpdate,


  render() {
    const {attacks, width, height} = this.props;
    return (
      <ReactBulkhead
        element="canvas"
        attacks={attacks}
        width={width}
        height={height}
        onCountrySelect={onCountrySelect}
        onCountryDeselect={onCountryDeselect}
        onCreate={onCreate} />
    );
  }
});


const mapStateToProps = ({
  attacks
}) => ({
  attacks
});


export const Globe = connect(
  mapStateToProps
)(GlobeContent);
