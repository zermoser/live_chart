import React, { useState, useEffect } from 'react';
import data from '../assets/db.json';

// Define TypeScript types for data structure
interface PopulationEntry {
  CountryName: string;
  Year: string;
  Population: string;
  color: string;
}

const Home: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(1950); // Initial year
  const [isRunning, setIsRunning] = useState<boolean>(true); // Start running automatically
  const [speed, setSpeed] = useState<number>(100); // Initial speed: Fast
  const [topCountriesData, setTopCountriesData] = useState<{ country: string; population: number; color: string; }[]>([]);
  const [worldPopulation, setWorldPopulation] = useState<number>(0);

  // Fetch data from db.json (in real app, you might fetch from an API)
  useEffect(() => {
    // Function to filter and process data for the current year
    const filterDataByYear = (year: number): void => {
      const filteredData = data.population.filter((entry: PopulationEntry) => parseInt(entry.Year) === year);

      // Calculate total world population for the current year
      const totalPopulation = filteredData.reduce((total, entry) => total + parseInt(entry.Population), 0);
      setWorldPopulation(totalPopulation);

      // Process data to calculate population for each country in the current year
      const countriesPopulation: { [key: string]: number } = {};
      filteredData.forEach((entry: PopulationEntry) => {
        const { CountryName, Population } = entry;
        countriesPopulation[CountryName] = (countriesPopulation[CountryName] || 0) + parseInt(Population);
      });

      // Convert to array and sort by population descending, then take top 12
      const sortedCountries = Object.keys(countriesPopulation).sort((a, b) => countriesPopulation[b] - countriesPopulation[a]).slice(0, 12);
      const topCountriesDataForYear = sortedCountries.map(country => ({
        country,
        population: countriesPopulation[country],
        color: filteredData.find(entry => entry.CountryName === country)?.color || '#000' // Default color if not found
      }));

      setTopCountriesData(topCountriesDataForYear);
    };

    // Initial data fetch for the starting year
    filterDataByYear(currentYear);

    // Interval to update year every speed ms if isRunning is true
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentYear(prevYear => {
          const nextYear = prevYear < 2021 ? prevYear + 1 : 1950; // Wrap around to 1950 after 2021
          filterDataByYear(nextYear);
          return nextYear;
        });
      }, speed);
    }

    // Cleanup interval on component unmount or isRunning/speed change
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentYear, isRunning, speed]); // Dependency array ensures effect runs on year, isRunning or speed change

  // Utility function to format population numbers with commas
  const formatPopulation = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Toggle start/stop
  const handleStartStop = () => {
    setIsRunning(prev => !prev);
  };

  // Handle year selection change
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value);
    setCurrentYear(selectedYear);
  };

  // Handle speed change
  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSpeed = parseInt(event.target.value);
    setSpeed(selectedSpeed);
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
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 2022 - 1950 }, (_, i) => 1950 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Speed:</span>
            <select
              value={speed}
              onChange={handleSpeedChange}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2000}>Slow</option>
              <option value={1000}>Normal</option>
              <option value={500}>Fast</option>
              <option value={100}>Very Fast</option>
            </select>
          </div>
        </div>

        <div className="table-container overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {/* Hide Country column on small screens */}
                <th scope="col" className="px-6 pb-2 text-right text-lg font-medium hidden lg:table-cell w-1/5">
                  Country
                </th>
                <th scope="col" className="px-6 pb-2 text-left text-lg font-medium lg:w-full w-4/5">
                  Population
                </th>
              </tr>
            </thead>
            <tbody>
              {topCountriesData.map((data, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right hidden lg:table-cell" style={{ color: data.color === '#000' ? '#ccc' : data.color }}>
                    {data.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="w-full h-4 relative">
                        <div className="h-full flex items-center justify-end pr-2" style={{ width: `${(data.population / worldPopulation) * 500}%`, backgroundColor: data.color === '#000' ? '#ccc' : data.color }}>
                          <span className="text-white text-xs font-medium">{formatPopulation(data.population)}</span>
                        </div>
                      </div>
                    </div>
                    {/* Display only on mobile screens */}
                    <div className="flex items-center space-x-4 lg:hidden">
                      <div className="w-full h-4 relative">
                        <div className="h-full flex items-center justify-start" style={{ width: `${(data.population / worldPopulation) * 500}%`, backgroundColor: '#fff' }}>
                          <span className="text-xs font-medium" style={{ color: data.color === '#000' ? '#ccc' : data.color }}>{data.country}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
