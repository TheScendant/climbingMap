import React, { Component } from 'react';
import Map from './Map';
import LocationControls from './LocationControls';
import './App.css';
import Header from './Header'

class App extends Component {
  render() {
    return (
      <div id="app">
        <Header />
        <div id="map">
          <Map />
        </div>
        <div id="locationControls">
          <LocationControls />
        </div>
      </div>
    );
  }
}

export default App;
