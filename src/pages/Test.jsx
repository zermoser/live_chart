import React, { useState, useEffect, useCallback } from 'react';
import ChartRace from 'react-chart-race';
import data from '../assets/db2.json';

const Test = () => {
  const [currentYear, setCurrentYear] = useState(1950);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(100);
  const [topCountriesData, setTopCountriesData] = useState([]);

  // Function to filter and update top countries data based on selected year
  const filterDataByYear = useCallback((year, populationData) => {
    const filteredData = populationData.filter(entry => entry.Year === year.toString());

    const countriesPopulation = {};
    filteredData.forEach(entry => {
      const { title, value } = entry;
      countriesPopulation[title] = (countriesPopulation[title] || 0) + parseInt(value);
    });

    const sortedCountries = Object.keys(countriesPopulation).sort((a, b) => countriesPopulation[b] - countriesPopulation[a]).slice(0, 12);
    const topCountriesDataForYear = sortedCountries.map(country => ({
      id: country,
      value: countriesPopulation[country],
      color: filteredData.find(entry => entry.title === country)?.color || '#000'
    }));

    setTopCountriesData(topCountriesDataForYear);
  }, []);

  // Effect to update data whenever currentYear changes
  useEffect(() => {
    filterDataByYear(currentYear, data);
  }, [currentYear, filterDataByYear]);

  // Effect to manage animation loop based on isRunning and speed
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentYear(prevYear => {
          const nextYear = prevYear < 2021 ? prevYear + 1 : 1950;
          filterDataByYear(nextYear, data);
          return nextYear;
        });
      }, speed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, speed, filterDataByYear]);

  // Handler to start/stop animation
  const handleStartStop = () => {
    setIsRunning(prev => !prev);
  };

  // Handler for year change
  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value);
    setCurrentYear(selectedYear);
  };

  // Handler for speed change
  const handleSpeedChange = (event) => {
    const selectedSpeed = parseInt(event.target.value);
    setSpeed(selectedSpeed);
  };

  // Function to format population numbers with commas
  const formatPopulation = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="flex justify-center w-full h-auto bg-gray-100 pb-6">
      <div className="bg-white shadow-lg rounded-lg w-full p-6 mt-6 mx-4 sm:mx-20 h-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Top Population Ranking: Year <span className='text-blue-600'>{currentYear}</span></h2>

        <div className="flex flex-col sm:flex-row justify-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4 items-center">
          <button
            onClick={handleStartStop}
            className={`w-full sm:w-auto px-10 py-2 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Year:</span>
            <select
              value={currentYear}
              onChange={handleYearChange}
              disabled={isRunning}
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
              value={speed}
              onChange={handleSpeedChange}
              disabled={isRunning}
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
            data={topCountriesData}
            backgroundColor="#fff"
            width={800}
            itemHeight={50}
            gap={4}
            title="Population by Country"
            titleStyle={{ fontSize: '1.5rem' }}
            valueFormatter={formatPopulation}
            animationDuration={speed} 
          />
        </div>
      </div>
    </div>
  );
};

export default Test;
