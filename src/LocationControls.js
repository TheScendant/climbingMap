import React, {Component} from 'react';
import LocationController from './LocationController'
import "./LocationControls.css"
class LocationControls extends Component {

  render() {
    return (
      <div className="location-controls">
        <LocationController name="Indoor"/>
        <LocationController name="Outdoor"/>
        <LocationController name="Bouldering"/>
        <LocationController name="Sport"/>
      </div>
    );
  }
}

export default LocationControls;