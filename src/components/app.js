import React, { Component } from "react";

import Picker from "./picker";
import Button from "./button";
import Clock from "./clock";
import ChangeDate from "./changeDate";
import LargeText from "./largeText";

import moment from "moment";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.timer = 0;

    this.state = {
      active: false,
      startDate: moment(),
      timeRemaining: moment.duration(),
      age: 0
    };

    this.handleGenerate = this.handleGenerate.bind(this);
  }

  handleClear = function() {
    this.setState({ active: false })
    clearInterval(this.timer)
  }

  handleChange = function(date) {
    this.setState({
      startDate: date
    });
  }.bind(this);

  handleGenerate = function() {
    clearInterval(this.timer)
   
    const bday = this.state.startDate;
    const nextBday = moment(bday);
    const calculateRemaining = function() {
      return moment.duration(nextBday.diff(moment()));
    }
    nextBday.set("year", moment().year());
    if(nextBday.isBefore( moment() )) {
      nextBday.add(1, 'year')
    }
    this.setState({
      age: moment().diff(bday, 'years') + 1,
      timeRemaining: calculateRemaining(),
      active: true
    });
    this.timer = setInterval(function() {
      this.setState({ timeRemaining: calculateRemaining() });
      if (moment.duration(this.state.timeRemaining).asSeconds() <= 0 ) {
        clearInterval(this.timer);
      }
    }.bind(this), 1000);
  }.bind(this);


  renderItems = function() {
    if (this.state.active) {
      return [
        <Clock key={0} timeRemaining={this.state.timeRemaining} />,
        ChangeDate("Change Date", () => this.handleClear()),
        LargeText(moment(this.state.startDate).format("MM/DD")),
        <label key={3} className="grid__remaining">
          Remaining until you turn {this.state.age}
        </label>
      ];
    } else {
      return [
        <Picker
          startDate={this.state.startDate}
          callback={date => this.handleChange(date)}
          key={0}
        />,
        Button("Generate Countdown", () => this.handleGenerate())
      ];
    }
  }.bind(this);

  render() {
    return (
      <div className="grid">
        <h1 className="grid__title">Birthday Countdown</h1>

        <div className="grid__skew-dark-two" />
        <div className="grid__skew-dark-three" />

        <div className="grid__skew-light-one" />
        <div className="grid__skew-light-two" />
        <div className="grid__skew-light-three-box" />

        {this.renderItems()}
      </div>
    );
  }
}
