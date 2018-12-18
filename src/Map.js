import React, { Component } from 'react';
import geoMap from './geoJSONs/lowerFourtyEight';
import pins from './geoJSONs/locations';
import cities from './geoJSONs/selectCities';
import * as d3 from 'd3';
import './Map.css';

class Map extends Component {
  constructor(props) {
    super(props);
    this.createMap = this.createMap.bind(this);
    this.createPins = this.createPins.bind(this);
    this.zoomFunction = this.zoomFunc.bind(this);
    this.createCities = this.createCities.bind(this);
    window.d3 = d3; // console debugging
    this.state = {
      citiesPlaced: false,
      tooltip: "",
      x: 50,
      y: 50,
    }
  }
  componentDidMount() {
    this.createMap();
    this.createPins();
  }
  componentDidUpdate() {
    this.createMap();
    this.createPins();
  }
  zoomFunc() {
    const t = d3.event.transform;
    const tString = `translate(${t.x}, ${t.y}) scale(${t.k})`;
    d3.select(this.countryPaths).attr("transform", tString);
    const locationPins = d3.select(this.locationPins)
    locationPins.attr("transform", tString);
    locationPins.selectAll("circle").attr("r", 5 / t.k);

    const cities = d3.select(this.cityData);
    cities.attr("transform", tString);
    cities.selectAll("circle").attr("r", 2 / t.k);
    cities.selectAll("text").attr("font-size", `${12 / t.k}px`);
    if (t.k >= 4 && !this.state.citiesPlaced) {
      this.createCities();
      this.setState({
        citiesPlaced: true,
        tooltip: this.state.tooltip,
        x: this.state.x,
        y: this.state.y,
      });
    } else if (t.k < 4 && this.state.citiesPlaced){
      this.hideCities();
      this.setState({
        citiesPlaced: false,
        tooltip: this.state.tooltip,
        x: this.state.x,
        y: this.state.y,
      });
    }
  }
  hideCities() {
    d3.selectAll(".city-text, .city-text-dot").remove();
  }
  createCities() {
    const citySel = d3.select(this.cityData);
    const citySelEnter = citySel
      .selectAll("text")
      .data(cities)
      .enter();
    citySelEnter
      .append("text")
      .text(d => d.city)
      .attr("x", d => this.projection([d.longitude, d.latitude])[0])
      .attr("y", d => this.projection([d.longitude, d.latitude])[1])
      .attr("font-size", "3px")
      .attr("class", "city-text");
    citySelEnter.append("circle")
      .attr("cx", d => this.projection([d.longitude, d.latitude])[0])
      .attr("cy", d => this.projection([d.longitude, d.latitude])[1])
      .attr("r", 0.5)
      .attr("class", "city-text-dot");
  }
  createPins() {
    const pinsSel = d3.select(this.locationPins);
    pinsSel
      .selectAll("circle")
      .data(pins.features) // dosomething make these more unique
      .enter()
      .append("circle");
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
      .attr("r", 5)
      .on("mouseenter", (d) => {
        // dosomething getbbrect
        this.setState({
          citiesPlaced: this.state.citiesPlaced,
          tooltip: "cookies",
          x: 100,
          y: 100,
        });
      })
      .on("mouseleave", () => {
        this.setState({
          citiesPlaced: this.state.citiesPlaced,
          tooltip: "",
          x: 0,
          y: 0,
        });
      });
  }
  createMap() {
    this.projection = d3.geoMercator().fitSize([this.svg.clientWidth, this.svg.clientHeight], geoMap);
    this.pathGenerator = d3.geoPath().projection(this.projection);
    this.zoom = d3.zoom().scaleExtent([.75, 12]).on("zoom", this.zoomFunction)
    const svgSel = d3.select(this.svg);
    // svgSel.call(this.zoom); dosomething disable soom
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
        <g id="g-cities" ref={g => this.cityData = g}></g>
        <text className="tooltip" style={{transform: `translate(${this.state.x}px, ${this.state.y}px`}}>
          {this.state.tooltip}
        </text>
      </svg>
    );
  }
}

export default Map;