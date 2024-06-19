import React, { Component } from 'react';
import ChartRace from 'react-chart-race';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.handleChange();
    this.interval = setInterval(this.handleChange, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleChange() {
    const data = [
      {
          "id": 988,
          "title": "World",
          "value": 2590271000 + Math.floor(Math.random() * 1000000),
          "color": "#4169E1"
      },
      {
          "id": 522,
          "title": "Less developed regions",
          "value": 1765613300 + Math.floor(Math.random() * 1000000),
          "color": "#F04864"
      },
      {
          "id": 666,
          "title": "Less developed regions, excluding least developed countries",
          "value": 1560329900 + Math.floor(Math.random() * 1000000),
          "color": "#00CCFF"
      },
      {
          "id": 55,
          "title": "Asia (UN)",
          "value": 1435002800 + Math.floor(Math.random() * 100000000000000),
          "color": "#32CD32"
      },
      {
          "id": 594,
          "title": "Less developed regions, excluding China",
          "value": 1190033300 + Math.floor(Math.random() * 100000000000000),
          "color": "#FF6600"
      },
      {
          "id": 916,
          "title": "Upper-middle-income countries",
          "value": 937054340 + Math.floor(Math.random() * 1),
          "color": "#F04864"
      },
      {
          "id": 836,
          "title": "More developed regions",
          "value": 824657600 + Math.floor(Math.random() * 1),
          "color": "#DB7093"
      },
      {
          "id": 738,
          "title": "Lower-middle-income countries",
          "value": 823223500 + Math.floor(Math.random() * 100000000000000),
          "color": "#4169E1"
      },
      {
          "id": 271,
          "title": "High-income countries",
          "value": 702997900 + Math.floor(Math.random() * 100000000000000),
          "color": "#223273"
      },
      {
          "id": 127,
          "title": "China",
          "value": 564954500 + Math.floor(Math.random() * 100000000000000),
          "color": "#8543E0"
      },
      {
          "id": 199,
          "title": "Europe (UN)",
          "value": 559609900 + Math.floor(Math.random() * 1000000),
          "color": "#8543E0"
      },
      {
          "id": 343,
          "title": "India",
          "value": 372997200 + Math.floor(Math.random() * 1000000),
          "color": "#FF6600"
      }
    ];
    this.setState({ data });
  }

  render() {
    return (
      <div>
        <ChartRace
          data={this.state.data}
          backgroundColor='#fff'
          width={760}
          padding={12}
          itemHeight={58}
          gap={12}
          titleStyle={{ font: 'normal 400 13px Arial', color: '#000' }}
          valueStyle={{ font: 'normal 400 11px Arial', color: 'rgba(0, 0, 0, 0.42)' }}
        />
      </div>
    );
  }
}
