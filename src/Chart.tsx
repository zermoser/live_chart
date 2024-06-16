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

  // Fetch data from db.json (in real app, you might fetch from an API)
  useEffect(() => {
    // Function to filter and process data for the current year
    const filterDataByYear = (year: number): void => {
      const filteredData = data.population.filter((entry: PopulationEntry) => parseInt(entry.Year) === year);

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

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-3xl p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">Top 12 Population Ranking: Year {currentYear}</h2>
        <div className="chart-container">
          <div className="bars-container">
            {topCountriesData.map((data, idx) => (
              <div key={idx} className="bar-item flex items-center mb-3">
                <div className="bar-label">{data.country}</div>
                <div className="bar-wrapper flex-grow">
                  <div className="bar" style={{ width: `${(data.population / 1000000) * 100}%`, backgroundColor: data.color }}>
                    <span className="text-white">{data.population}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
