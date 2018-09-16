import React, { Component } from 'react';
import geoMap from './geoMap';
import * as d3 from 'd3';
import './Map.css';

class Map extends Component {
  constructor(props) {
    super(props);
    this.createMap = this.createMap.bind(this);
    this.zoomFunction = this.zoomFunc.bind(this);
    window.d3 = d3; // console debugging
  }
  componentDidMount() {
    this.createMap()
  }
  componentDidUpdate() {
    this.createMap()
    console.warn('componentDidUpdate');
  }
  zoomFunc() {
    const t = d3.event.transform;
    const tString = `translate(${t.x}, ${t.y}) scale(${t.k})`;
    d3.select(this.countryPaths).attr("transform", tString);
  }
  createMap() {
    const projection = d3.geoMercator().fitSize([this.svg.clientWidth, this.svg.clientHeight], geoMap);
    const pathGenerator = d3.geoPath().projection(projection);
    this.zoom = d3.zoom().on("zoom", this.zoomFunction)
    const svgSel = d3.select(this.svg);
    svgSel.call(this.zoom);
    const countPathsSel = d3.select(this.countryPaths);
    countPathsSel
      .selectAll('path')
      .data(geoMap.features)
      .enter()
      .append('path')

    countPathsSel
      .selectAll('path')
      .data(geoMap.features)
      .exit()
      .remove()

    countPathsSel
      .selectAll('path')
      .data(geoMap.features)
      .attr("d", d => pathGenerator(d));
  }
  render() {
    return (
      <svg id="mapSVG" ref={svg => this.svg = svg} >
        <g id="countryPaths" ref={g => this.countryPaths = g}></g>
      </svg>);
  }
}

export default Map;