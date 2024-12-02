import React, { useState, useEffect } from 'react';
import { Car } from '../types';

interface FavoriteCarsProps {
  cars: Car[];
  selectedCars: Car[] | undefined;
  onChange: (selectedCars: Car[]) => void;
}

const FavoriteCars: React.FC<FavoriteCarsProps> = ({ cars, selectedCars, onChange }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCars, setVisibleCars] = useState<Car[]>([]);
  const [selectedCarsState, setSelectedCarsState] = useState<Car[]>([]);
  
  const itemHeight = 35;
  const containerHeight = itemHeight * 4;

  useEffect(() => {
    setVisibleCars(cars.slice(0, 4));
  }, [cars]);

  useEffect(() => {
    setSelectedCarsState(selectedCars || []);
  }, [selectedCars]);

  const filterDataBySearchQuery = (data: Car) => {
    const dataInfo = `${data.id}-${data.mark} ${data.model}`.toLowerCase();
    
    // Normalize searchQuery to lowercase and remove hyphens and spaces
    const normalizedSearchQuery = searchQuery.toLowerCase().replace(/[-\s]/g, '');

    // Normalize driverInfo to lowercase and remove hyphens and spaces
    const normalizedDataInfo = dataInfo.replace(/[-\s]/g, '');
    
    return normalizedDataInfo.includes(normalizedSearchQuery);
  };

  const filteredData = cars.filter(filterDataBySearchQuery);

  const handleScroll = () => {
    const container = document.getElementById('car-list');
    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setVisibleCars(prevVisibleCars => {
          const currentCount = prevVisibleCars.length;
          const nextCars = cars.slice(currentCount, currentCount + 4);
          return [...prevVisibleCars, ...nextCars];
        });
      }
    }
  };

  const handleCheckboxChange = (car: Car) => {
    const isSelected = selectedCarsState.some(selectedCar => selectedCar.id === car.id);
    const newSelectedCars = isSelected
      ? selectedCarsState.filter(selectedCar => selectedCar.id !== car.id)
      : [...selectedCarsState, car];
    setSelectedCarsState(newSelectedCars);
    onChange(newSelectedCars);
  };

  return (
    <fieldset className="relative">
      <input
        type="text"
        placeholder="Search Cars"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 p-2 rounded-md mb-2 w-full"
      />
      <div
        id="car-list"
        className="overflow-y-auto border border-gray-300 px-2 rounded-md"
        style={{ maxHeight: containerHeight }}
        onScroll={handleScroll}
      >
        {filteredData.length > 0 ? filteredData.slice(0, visibleCars.length).map(car => (
          <div key={car.id} className="flex items-center" style={{ height: itemHeight }}>
            <input
              type="checkbox"
              id={`car-${car.id}`}
              checked={selectedCarsState.some(selectedCar => selectedCar.id === car.id)}
              onChange={() => handleCheckboxChange(car)}
              className="mr-2"
            />
            <label htmlFor={`car-${car.id}`} className="text-gray-700">
              {`${car.id}-${car.mark} ${car.model}`}
            </label>
          </div>
        )) : (
          <p className="text-gray-600">No cars found</p>
        )}
      </div>
    </fieldset>
  );
};

export default FavoriteCars;
