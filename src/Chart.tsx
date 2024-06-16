import React, { useState, useEffect } from 'react';
import data from './db.json'; // Adjust path as per your project structure

// Define TypeScript types for data structure
interface PopulationEntry {
  CountryName: string;
  Year: string;
  Population: string;
  color: string;
}

const Chart: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(1950); // Initial year
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

    // Interval to update year every 1 second
    const interval = setInterval(() => {
      filterDataByYear(currentYear);
      setCurrentYear(prevYear => (prevYear < 2021 ? prevYear + 1 : 1950)); // Wrap around to 1950 after 2021
    }, 1000);

    // Initial data fetch for the starting year
    filterDataByYear(currentYear);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [currentYear]); // Dependency array ensures effect runs on year change

  // Utility function to format population numbers with commas
  const formatPopulation = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">Top 12 Population Ranking: Year {currentYear}</h2>
        <div className="table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Country
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/5">
                  Population
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topCountriesData.map((data, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/5">{data.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-4/5">
                    <div className="flex items-center space-x-4">
                      <div className="w-full bg-gray-300 rounded-full overflow-hidden h-4">
                        <div className="rounded-full h-4" style={{ width: `${(data.population / worldPopulation) * 500}%`, backgroundColor: data.color === '#000' ? '#ccc' : data.color }}></div>
                      </div>
                      <span className="ml-2">{formatPopulation(data.population)}</span>
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

export default Chart;
