import React, { useState, useEffect } from 'react';
import ChartRace from 'react-chart-race';

const App = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(2000); // Example initial speed
  const [topCountriesData, setTopCountriesData] = useState([]);

  // Mock function to fetch or generate data (replace with actual data fetching logic)
  const handleChange = () => {
    const data = [
      { id: 0, title: 'Ayfonkarahisar', value: getRandomInt(10, 90), color: '#50c4fe' },
      { id: 1, title: 'Kayseri', value: 38, color: '#3fc42d' },
      { id: 2, title: 'Muğla', value: getRandomInt(10, 90), color: '#c33178' },
      { id: 3, title: 'Uşak', value: getRandomInt(10, 90), color: '#423bce' },
      { id: 4, title: 'Sivas', value: 58, color: '#c8303b' },
      { id: 5, title: 'Konya', value: 16, color: '#2c2c2c' }
    ];
    setTopCountriesData(data);
  };

  // Mock function to generate random integer within a range
  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // UseEffect to start/stop animation and update data based on speed
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        handleChange(); // Fetch or generate new data
      }, speed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, speed]);

  // Handler to start/stop animation
  const handleStartStop = () => {
    setIsRunning(prev => !prev);
  };

  // Handler for speed change
  const handleSpeedChange = (event) => {
    const selectedSpeed = parseInt(event.target.value);
    setSpeed(selectedSpeed);
  };

  return (
    <div>
      <div className="flex justify-center w-full h-auto bg-gray-100 pb-6">
        <div className="bg-white shadow-lg rounded-lg w-full p-6 mt-6 mx-4 sm:mx-20 h-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Top Population Ranking: Year <span className='text-blue-600'></span></h2>

          <div className="flex flex-col sm:flex-row justify-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4 items-center">
            <button
              onClick={handleStartStop}
              className={`w-full sm:w-auto px-10 py-2 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isRunning ? 'Stop' : 'Start'}
            </button>
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
              backgroundColor='#fff'
              width={760}
              padding={12}
              itemHeight={58}
              gap={12}
              titleStyle={{ font: 'normal 400 13px Arial', color: '#000' }}
              valueStyle={{ font: 'normal 400 11px Arial', color: 'rgba(0, 0, 0, 0.42)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
