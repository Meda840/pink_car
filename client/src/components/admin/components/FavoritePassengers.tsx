import React, { useState, useEffect } from 'react';
import { PassengerProfile, User } from '../types';

interface FavoritePassengersProps {
  passengers: PassengerProfile[];
  users: User[];
  allowMultipleSelections: boolean;
  selectedPassengers: PassengerProfile[];
  onChange: (selectedPassengers: PassengerProfile[]) => void;
}

const FavoritePassengers: React.FC<FavoritePassengersProps> = ({
  passengers,
  users,
  allowMultipleSelections,
  selectedPassengers,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visiblePassengers, setVisiblePassengers] = useState<PassengerProfile[]>([]);

  const itemHeight = 35;
  const containerHeight = itemHeight * 4;

  useEffect(() => {
    setVisiblePassengers(passengers.slice(0, 4));
  }, [passengers]);

  const getUserName = (userId: number) => {
    const user = users.find(user => user.id === userId);
    return user ? user.username : 'Unknown';
  };

  const filterDataBySearchQuery = (data: PassengerProfile) => {
    const userName = getUserName(data.userId);
    const dataInfo = `${data.id} - ${userName}`.toLowerCase();
    
    // Normalize searchQuery to lowercase and remove hyphens and spaces
    const normalizedSearchQuery = searchQuery.toLowerCase().replace(/[-\s]/g, '');

    // Normalize dataInfo to lowercase and remove hyphens and spaces
    const normalizedDataInfo = dataInfo.replace(/[-\s]/g, '');
    
    return normalizedDataInfo.includes(normalizedSearchQuery);
  };

  const filteredData = passengers.filter(filterDataBySearchQuery);

  const handleScroll = () => {
    const container = document.getElementById('passenger-list');
    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setVisiblePassengers(prevVisiblePassengers => {
          const currentCount = prevVisiblePassengers.length;
          const nextPassengers = passengers.slice(currentCount, currentCount + 4);
          return [...prevVisiblePassengers, ...nextPassengers];
        });
      }
    }
  };

  const handleCheckboxChange = (passenger: PassengerProfile) => {
    if (allowMultipleSelections) {
      const isSelected = selectedPassengers.some(selectedPassenger => selectedPassenger.id === passenger.id);
      const newSelectedPassengers = isSelected
        ? selectedPassengers.filter(p => p.id !== passenger.id)
        : [...selectedPassengers, passenger];
      onChange(newSelectedPassengers);
    } else {
      const isSelected = selectedPassengers.some(selectedPassenger => selectedPassenger.id === passenger.id);
      const newSelectedPassengers = isSelected
        ? [] // Uncheck if already checked
        : [passenger]; // Select only this one
      onChange(newSelectedPassengers);
    }
  };

  return (
    <fieldset className="relative">
      <input
        type="text"
        placeholder="Search Passengers"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 p-2 rounded-md mb-2 w-full"
      />
      <div
        id="passenger-list"
        className="overflow-y-auto border border-gray-300 px-2 rounded-md"
        style={{ maxHeight: containerHeight }}
        onScroll={handleScroll}
      >
        {filteredData.length > 0 ? filteredData.slice(0, visiblePassengers.length).map(passenger => (
          <div key={passenger.id} className="flex items-center" style={{ height: itemHeight }}>
            <input
              type="checkbox"
              id={`passenger-${passenger.id}`}
              checked={selectedPassengers.some(selectedPassenger => selectedPassenger.id === passenger.id)}
              onChange={() => handleCheckboxChange(passenger)}
              className="mr-2"
            />
            <label htmlFor={`passenger-${passenger.id}`} className="text-gray-700">
              {`${passenger.id}- ${getUserName(passenger.userId)}`}
            </label>
          </div>
        )) : (
          <p className="text-gray-600">No passengers found</p>
        )}
      </div>
    </fieldset>
  );
};

export default FavoritePassengers;