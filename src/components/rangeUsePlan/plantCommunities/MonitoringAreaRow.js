import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getMonitoringAreaPurposes, handleNullValue } from '../../../utils';

class MonitoringAreaRow extends Component {
  static propTypes = {
    monitoringArea: PropTypes.shape({}).isRequired,
  }

  render() {
    const { monitoringArea } = this.props;
    const {
      latitude,
      location,
      longitude,
      name,
      otherPurpose,
      purposes,
      rangelandHealth,
    } = monitoringArea;
    // console.log(monitoringArea);

    const rangelandHealthName = rangelandHealth && rangelandHealth.name;
    const purposeNames = getMonitoringAreaPurposes(purposes, otherPurpose);

    return (
      <div className="rup__plant-community__m-area__row">
        <div>
          Monitoring Area: {name}
        </div>
        <div className="rup__row">
          <div className="rup__cell-6">
            <div className="rup__plant-community__m-area__label">
              Location
            </div>
            <div>
              {handleNullValue(location)}
            </div>
          </div>
          <div className="rup__cell-6">
            <div className="rup__plant-community__m-area__label">
              Rangeland Health
            </div>
            <div>
              {handleNullValue(rangelandHealthName)}
            </div>
          </div>
        </div>
        <div className="rup__plant-community__m-area__label">
          Purposes
        </div>
        <div>
          {handleNullValue(purposeNames)}
        </div>
        <div className="rup__row">
          <div className="rup__cell-6">
            <div className="rup__plant-community__m-area__label">
              Latitude
            </div>
            <div>
              {handleNullValue(latitude)}
            </div>
          </div>
          <div className="rup__cell-6">
            <div className="rup__plant-community__m-area__label">
              Longitude
            </div>
            <div>
              {handleNullValue(longitude)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MonitoringAreaRow;
