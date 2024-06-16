import React from 'react';
import data from './db.json'; 

type PopulationEntry = {
  CountryName: string;
  Year: string;
  Population: string;
  color: string;
};

const ChartComponent: React.FC = () => {
  // Transform data for CSS-based bar chart
  const countriesData: { [key: string]: { year: string, population: number }[] } = data.population.reduce((acc, entry: PopulationEntry) => {
    if (!acc[entry.CountryName]) {
      acc[entry.CountryName] = [];
    }
    acc[entry.CountryName].push({ year: entry.Year, population: parseInt(entry.Population) });
    return acc;
  }, {});

  // Sort countries by total population (descending order)
  const sortedCountries = Object.keys(countriesData).sort((a, b) => {
    const totalA = countriesData[a].reduce((total, entry) => total + entry.population, 0);
    const totalB = countriesData[b].reduce((total, entry) => total + entry.population, 0);
    return totalB - totalA;
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-96 p-4">
        <h2 className="text-xl font-semibold mb-4">Population Bar Chart</h2>
        <div className="chart-container">
          {sortedCountries.map((country, index) => (
            <div
              key={index}
              className="bar flex items-center justify-between mb-2"
              style={{
                background: data.population.find((entry: PopulationEntry) => entry.CountryName === country)?.color || '#000',
                width: `${countriesData[country][0].population / 1000000}rem` // Adjust width based on population
              }}
            >
              <span className="text-white px-2">{country}</span>
              <span className="text-white px-2">{countriesData[country][0].population}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
