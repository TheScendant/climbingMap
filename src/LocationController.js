import React, { Component } from 'react';
class LocationController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected,
    };
  }
  handleClick() {
    console.warn("clicked");
    this.setState({
      selected: !this.state.selected
    });
  }
  calcSelectedClass() {
    return this.state.selected ? "selected" : "";
  }
  render() {
    const name = this.props.name;
    const selectedClass = this.calcSelectedClass();
    return (
      <div className={`location-controller ${selectedClass}`} onClick={() => this.handleClick()}>
        {name}
      </div>
    );
  }
}
export default LocationController;