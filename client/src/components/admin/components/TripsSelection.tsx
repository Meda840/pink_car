import React, { useState, useEffect } from 'react';
import { Trip } from '../types';

interface FavoriteTripsProps {
  trips: Trip[];
  selectedTrips: Trip[];
  onChange: (selectedTrips: Trip[]) => void;
}

const FavoriteTrips: React.FC<FavoriteTripsProps> = ({ trips, selectedTrips, onChange }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleTrips, setVisibleTrips] = useState<Trip[]>([]);

  const itemHeight = 35;
  const containerHeight = itemHeight * 4;

  useEffect(() => {
    setVisibleTrips(trips.slice(0, 4));
  }, [trips]);

  const filterDataBySearchQuery = (data: Trip) => {
    const dataInfo = `Trip from ${data.start} to ${data.destination}`.toLowerCase();
    
    // Normalize searchQuery to lowercase and remove hyphens and spaces
    const normalizedSearchQuery = searchQuery.toLowerCase().replace(/[-\s]/g, '');

    // Normalize dataInfo to lowercase and remove hyphens and spaces
    const normalizedDataInfo = dataInfo.replace(/[-\s]/g, '');
    
    return normalizedDataInfo.includes(normalizedSearchQuery);
  };

  const filteredData = trips.filter(filterDataBySearchQuery);

  const handleScroll = () => {
    const container = document.getElementById('trip-list');
    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setVisibleTrips(prevVisibleTrips => {
          const currentCount = prevVisibleTrips.length;
          const nextTrips = trips.slice(currentCount, currentCount + 4);
          return [...prevVisibleTrips, ...nextTrips];
        });
      }
    }
  };

  const handleCheckboxChange = (trip: Trip) => {
    const isSelected = selectedTrips.some(selectedTrip => selectedTrip.id === trip.id);
    const newSelectedTrips = isSelected
      ? selectedTrips.filter(selectedTrip => selectedTrip.id !== trip.id)
      : [...selectedTrips, trip];
    onChange(newSelectedTrips);
  };

  return (
    <fieldset className="relative">
      <input
        type="text"
        placeholder="Search Trips"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 p-2 rounded-md mb-2 w-full"
      />
      <div
        id="trip-list"
        className="overflow-y-auto border border-gray-300 px-2 rounded-md"
        style={{ maxHeight: containerHeight }}
        onScroll={handleScroll}
      >
        {filteredData.length > 0 ? filteredData.slice(0, visibleTrips.length).map(trip => (
          <div key={trip.id} className="flex items-center" style={{ height: itemHeight }}>
            <input
              type="checkbox"
              id={`trip-${trip.id}`}
              checked={selectedTrips.some(selectedTrip => selectedTrip.id === trip.id)}
              onChange={() => handleCheckboxChange(trip)}
              className="mr-2"
            />
            <label htmlFor={`trip-${trip.id}`} className="text-gray-700">
              {`Trip from ${trip.start} to ${trip.destination}`}
            </label>
          </div>
        )) : (
          <p className="text-gray-600">No trips found</p>
        )}
      </div>
    </fieldset>
  );
};

export default FavoriteTrips;
