import React, { useState, useEffect } from 'react';
import { DriverProfile, User } from '../types';

interface FavoriteDriversProps {
  drivers: DriverProfile[];
  users: User[];
  allowMultipleSelections: boolean;
  selectedDrivers: DriverProfile[];
  onChange: (selectedDrivers: DriverProfile[]) => void;
}

const FavoriteDrivers: React.FC<FavoriteDriversProps> = ({
  drivers,
  users,
  allowMultipleSelections,
  selectedDrivers,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleDrivers, setVisibleDrivers] = useState<DriverProfile[]>([]);

  const itemHeight = 35;
  const containerHeight = itemHeight * 4;

  useEffect(() => {
    setVisibleDrivers(drivers.slice(0, 4));
  }, [drivers]);

  const getUserName = (userId: number) => {
    const user = users.find(user => user.id === userId);
    return user ? user.username : 'Unknown';
  };

  const filterDataBySearchQuery = (data: DriverProfile) => {
    const userName = getUserName(data.userId);
    const dataInfo = `${data.id} - ${userName}`.toLowerCase();
    
    // Normalize searchQuery to lowercase and remove hyphens and spaces
    const normalizedSearchQuery = searchQuery.toLowerCase().replace(/[-\s]/g, '');

    // Normalize driverInfo to lowercase and remove hyphens and spaces
    const normalizedDataInfo = dataInfo.replace(/[-\s]/g, '');
    
    return normalizedDataInfo.includes(normalizedSearchQuery);
  };

  const filteredData = drivers.filter(filterDataBySearchQuery);

  const handleScroll = () => {
    const container = document.getElementById('driver-list');
    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setVisibleDrivers(prevVisibleDrivers => {
          const currentCount = prevVisibleDrivers.length;
          const nextDrivers = drivers.slice(currentCount, currentCount + 4);
          return [...prevVisibleDrivers, ...nextDrivers];
        });
      }
    }
  };

  const handleCheckboxChange = (driver: DriverProfile) => {
    if (allowMultipleSelections) {
      const isSelected = selectedDrivers.some(selectedDriver => selectedDriver.id === driver.id);
      const newSelectedDrivers = isSelected
        ? selectedDrivers.filter(selectedDriver => selectedDriver.id !== driver.id)
        : [...selectedDrivers, driver];
      onChange(newSelectedDrivers);
    } else {
      const isSelected = selectedDrivers.some(selectedDriver => selectedDriver.id === driver.id);
      const newSelectedDrivers = isSelected
        ? [] // Uncheck if already checked
        : [driver]; // Select only this one
      onChange(newSelectedDrivers);
    }
  };

  return (
    <fieldset className="relative">
      <input
        type="text"
        placeholder="Search Drivers"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 p-2 rounded-md mb-2 w-full"
      />
      <div
        id="driver-list"
        className="overflow-y-auto border border-gray-300 px-2 rounded-md"
        style={{ maxHeight: containerHeight }}
        onScroll={handleScroll}
      >
        {filteredData.length > 0 ? filteredData.slice(0, visibleDrivers.length).map(driver => (
          <div key={driver.id} className="flex items-center" style={{ height: itemHeight }}>
            <input
              type="checkbox"
              id={`driver-${driver.id}`}
              checked={selectedDrivers.some(selectedDriver => selectedDriver.id === driver.id)}
              onChange={() => handleCheckboxChange(driver)}
              className="mr-2"
            />
            <label htmlFor={`driver-${driver.id}`} className="text-gray-700">
              {`${driver.id} - ${getUserName(driver.userId)}`}
            </label>
          </div>
        )) : (
          <p className="text-gray-600">No drivers found</p>
        )}
      </div>
    </fieldset>
  );
};

export default FavoriteDrivers;
