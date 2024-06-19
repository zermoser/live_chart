import React, { Component } from 'react';
import ChartRace from 'react-chart-race';
import data from '../assets/db5.json';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentYear: 1950,
      isRunning: true,
      speed: 1000,
      countryData: []
    };
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleSpeedChange = this.handleSpeedChange.bind(this);
  }

  componentDidMount() {
    this.filterDataByYear(this.state.currentYear);
    this.interval = setInterval(() => {
      if (this.state.isRunning) {
        this.setState(prevState => {
          const nextYear = prevState.currentYear < 2021 ? prevState.currentYear + 1 : 1950;
          this.filterDataByYear(nextYear);
          return { currentYear: nextYear };
        });
      }
    }, this.state.speed);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.speed !== this.state.speed) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        if (this.state.isRunning) {
          this.setState(prevState => {
            const nextYear = prevState.currentYear < 2021 ? prevState.currentYear + 1 : 1950;
            this.filterDataByYear(nextYear);
            return { currentYear: nextYear };
          });
        }
      }, this.state.speed);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  filterDataByYear(year) {
    const filteredData = data
      .filter(item => item.year === year.toString())
      .map(item => ({
        id: parseInt(item.value),
        title: item.title,
        value: parseInt(item.value),
        color: item.color,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12);
    this.setState({ countryData: filteredData });
  }

  handleStartStop() {
    this.setState(prevState => ({ isRunning: !prevState.isRunning }));
  }

  handleYearChange(e) {
    const newYear = parseInt(e.target.value);
    this.setState({ currentYear: newYear });
    this.filterDataByYear(newYear);
  }

  handleSpeedChange(e) {
    this.setState({ speed: parseInt(e.target.value) });
  }

  render() {
    return (
      <div className="flex justify-center w-full h-auto bg-gray-100 pb-6">
        <div className="bg-white shadow-lg rounded-lg w-full p-6 mt-6 mx-4 sm:mx-20 h-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Top Population Ranking: Year <span className='text-blue-600'>{this.state.currentYear}</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4 items-center">
            <button
              onClick={this.handleStartStop}
              className={`w-full sm:w-auto px-10 py-2 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${this.state.isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {this.state.isRunning ? 'Stop' : 'Start'}
            </button>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Year:</span>
              <select
                value={this.state.currentYear}
                onChange={this.handleYearChange}
                disabled={this.state.isRunning}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 2021 - 1950 + 1 }, (_, i) => 1950 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Speed:</span>
              <select
                value={this.state.speed}
                onChange={this.handleSpeedChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2000}>Slow</option>
                <option value={1000}>Normal</option>
                <option value={500}>Fast</option>
                <option value={100}>Very Fast</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <ChartRace
              data={this.state.countryData}
              backgroundColor='#fff'
              width={760}
              padding={12}
              itemHeight={58}
              titleStyle={{ font: 'normal 400 13px Arial', color: '#000' }}
              valueStyle={{ font: 'normal 400 11px Arial', color: 'rgba(0, 0, 0, 0.42)' }}
              animationDuration={this.state.speed}
            />
          </div>
        </div>
      </div>
    );
  }
}
