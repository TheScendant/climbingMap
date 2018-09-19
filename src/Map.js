import React, { Component } from 'react';
import geoMap from './geoJSONs/lowerFourtyEight';
import pins from './geoJSONs/locations';
import * as d3 from 'd3';
import './Map.css';

class Map extends Component {
  constructor(props) {
    super(props);
    this.createMap = this.createMap.bind(this);
    this.createPins = this.createPins.bind(this);
    this.zoomFunction = this.zoomFunc.bind(this);
    window.d3 = d3; // console debugging
  }
  componentDidMount() {
    this.createMap();
    this.createPins();
  }
  componentDidUpdate() {
    this.createMap();
    this.createPins();
    console.warn('componentDidUpdate');
  }
  zoomFunc() {
    const t = d3.event.transform;
    const tString = `translate(${t.x}, ${t.y}) scale(${t.k})`;
    d3.select(this.countryPaths).attr("transform", tString);
    d3.select(this.locationPins).attr("transform", tString);
  }
  createPins() {
    const pinsSel = d3.select(this.locationPins);
    pinsSel
      .selectAll("circle")
      .data(pins.features) // dosomething make these more unique
      .enter()
      .append("circle")
      pinsSel
      .selectAll("circle")
      .data(pins.features)
      .exit()
      .remove();

      pinsSel
      .selectAll("circle")
      .data(pins.features)
      .attr("class", d => {
        let res;
        if (d.properties.location_type === "Outdoor") {
          res = "location-pin-outdoor";
        } else {
          res = "location-pin-indoor";
        }
        return `${res} location-pin`;
      })
      .attr("cx", d => this.projection(d.geometry.coordinates)[0])
      .attr("cy", d => this.projection(d.geometry.coordinates)[1])
      .attr("r", 5);
  }
  createMap() {
    this.projection = d3.geoMercator().fitSize([this.svg.clientWidth, this.svg.clientHeight], geoMap);
    this.pathGenerator = d3.geoPath().projection(this.projection);
    this.zoom = d3.zoom().on("zoom", this.zoomFunction)
    const svgSel = d3.select(this.svg);
    svgSel.call(this.zoom);
    const countPathsSel = d3.select(this.countryPaths);
    countPathsSel
      .selectAll('path')
      .data(geoMap.features)
      .enter()
      .append('path');

    countPathsSel
      .selectAll('path')
      .data(geoMap.features)
      .exit()
      .remove();

    countPathsSel
      .selectAll('path')
      .data(geoMap.features)
      .attr("class", "country-path")
      .attr("d", d => this.pathGenerator(d));
  }
  render() {
    return (
      <svg id="map-svg" ref={svg => this.svg = svg} >
        <g id="g-country-paths" ref={g => this.countryPaths = g}></g>
        <g id="g-location-pins" ref={g => this.locationPins = g}></g>
      </svg>
    );
  }
}

export default Map;