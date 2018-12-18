import React, { Component } from 'react';
import './MapControls.css';
class MapControls extends Component {
  handleClick() {
    console.warn("cookies")
  }
  render() {
    return (
      <div>
        <div className="square" onClick={this.handleClick}></div>
      </div>
    )
  }
};
export default MapControls;