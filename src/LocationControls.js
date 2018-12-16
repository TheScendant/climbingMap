import React, {Component} from 'react';
import LocationController from './LocationController'
import "./LocationControls.css"
class LocationControls extends Component {

  render() {
    return (
      <div className="location-controls">
        <LocationController selected={false} name="Indoor"/>
        <LocationController selected={true} name="Outdoor"/>
        <LocationController selected={false} name="Bouldering"/>
        <LocationController selected={true} name="Sport"/>
        <LocationController selected={false} name="Trad"/>
      </div>
    );
  }
}

export default LocationControls;