import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Car } from './types';

const Cars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  const [newCar, setNewCar] = useState<Partial<Car>>({
    mark: '',
    model: '',
    capacity: 0,
    isAutomatic: false,
    year: currentYear,
    city: '',
    price: 0,
    isAvailable: true,
  });
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // const suggestionsRef = useRef<HTMLUListElement>(null);

  const [citySuggestionsNewCar, setCitySuggestionsNewCar] = useState<string[]>([]);
  const [citySuggestionsEditCar, setCitySuggestionsEditCar] = useState<string[]>([]);

  const suggestionsRefNewCar = useRef<HTMLUListElement>(null);
  const suggestionsRefEditCar = useRef<HTMLUListElement>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRefNewCar.current && !suggestionsRefNewCar.current.contains(event.target as Node)) {
        setCitySuggestionsNewCar([]);
      }
      if (suggestionsRefEditCar.current && !suggestionsRefEditCar.current.contains(event.target as Node)) {
        setCitySuggestionsEditCar([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('/car');
      setCars(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch cars');
      setLoading(false);
    }
  };


  // Fetch city suggestions for newCar input
  const fetchCitySuggestionsNewCar = async (query: string) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
        },
      });
      setCitySuggestionsNewCar(response.data.map((result: any) => result.display_name));
    } catch (error) {
      setCityError('Error fetching city suggestions');
    }
  };

  // Fetch city suggestions for editingCar input
  const fetchCitySuggestionsEditCar = async (query: string) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
        },
      });
      setCitySuggestionsEditCar(response.data.map((result: any) => result.display_name));
    } catch (error) {
      setCityError('Error fetching city suggestions');
    }
  };

  const handleCityChangeNewCar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const city = e.target.value;
    setNewCar({ ...newCar, city });
    if (city.length > 2) {
      await fetchCitySuggestionsNewCar(city);
    } else {
      setCitySuggestionsNewCar([]);
    }
  };

  const handleCityChangeEditCar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const city = e.target.value;
    if (editingCar) {
      setEditingCar({ ...editingCar, city });
      if (city.length > 2) {
        await fetchCitySuggestionsEditCar(city);
      } else {
        setCitySuggestionsEditCar([]);
      }
    }
  };

  const handleCitySelectNewCar = (city: string) => {
    setNewCar({ ...newCar, city });
    setCitySuggestionsNewCar([]);
  };

  const handleCitySelectEditCar = (city: string) => {
    if (editingCar) {
      setEditingCar({ ...editingCar, city });
      setCitySuggestionsEditCar([]);
    }
  };

  const validateCity = async (city: string) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: city,
          format: 'json',
          addressdetails: 1,
        },
      });
      if (response.data.length === 0) {
        setCityError('Invalid city name');
        return false;
      }
      setCityError(null);
      return true;
    } catch (error) {
      setCityError('Error validating city name');
      return false;
    }
  };


  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/car/${id}`);
      setCars(cars.filter(car => car.id !== id));
    } catch (error) {
      setError('Failed to delete car');
    }
  };

  const handleAddCar = async () => {
    // Validate that required fields are not empty or null
    if (!newCar || !newCar.mark || !newCar.model || newCar.capacity === 0 || !newCar.year || !newCar.city || newCar.price === 0) {
      setError('All fields are required and cannot be empty');
      return;
    }

    if (newCar.year as number > currentYear) {
      setError('Year cannot be greater than the current year');
      return;
    }
    if (await !validateCity(newCar.city || '')) {
      return;
    }

    try {
      const response = await axios.post('/car', newCar);
      setCars([...cars, response.data]);
      setNewCar({
        mark: '',
        model: '',
        capacity: 0,
        isAutomatic: false,
        year: currentYear,
        city: '',
        price: 0,
        isAvailable: true,
      });
      setCitySuggestionsNewCar([]);
    } catch (error) {
      setError('Failed to add car');
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
  };

  const handleUpdateCar = async () => {
  if (!editingCar || !editingCar.mark || !editingCar.model || editingCar.capacity === 0 || !editingCar.year || !editingCar.city|| editingCar.price === 0) {
    setError('All fields are required and cannot be empty');
    return;
  }

    if (editingCar && editingCar.year > currentYear) {
      setError('Year cannot be greater than the current year');
      return;
    }
    if (editingCar && !(await validateCity(editingCar.city || ''))) {
      return;
    }
    
    if (editingCar) {
      try {
        await axios.put(`/car/${editingCar.id}`, editingCar);
        setCars(cars.map(car => (car.id === editingCar.id ? editingCar : car)));
        setEditingCar(null);
        setCitySuggestionsEditCar([]);
      } catch (error) {
        setError('Failed to update car');
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Cars</h1>
      {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-pink-500 text-white">
              <tr>
                <th className="w-1/8 px-4 py-2">ID</th>
                <th className="w-1/8 px-4 py-2">Mark</th>
                <th className="w-1/8 px-4 py-2">Model</th>
                <th className="w-1/8 px-4 py-2">Capacity</th>
                <th className="w-1/8 px-4 py-2">Automatic</th>
                <th className="w-1/8 px-4 py-2">Year</th>
                <th className="w-1/8 px-4 py-2">City</th>
                <th className="w-1/8 px-4 py-2">Price</th>
                <th className="w-1/8 px-4 py-2">Available</th>
                <th className="w-1/8 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{car.id}</td>
                  <td className="px-4 py-2">{car.mark}</td>
                  <td className="px-4 py-2">{car.model}</td>
                  <td className="px-4 py-2">{car.capacity}</td>
                  <td className="px-4 py-2">{car.isAutomatic ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">{car.year}</td>
                  <td className="px-4 py-2">{car.city}</td>
                  <td className="px-4 py-2">{car.price.toFixed(2)}</td>
                  <td className="px-4 py-2">{car.isAvailable ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md mr-2"
                      onClick={() => handleDelete(car.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      onClick={() => handleEdit(car)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Car</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Mark"
            value={newCar.mark || ''}
            onChange={(e) => setNewCar({ ...newCar, mark: e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Model"
            value={newCar.model || ''}
            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newCar.capacity || ''}
            onChange={(e) => setNewCar({ ...newCar, capacity: +e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newCar.isAutomatic || false}
              onChange={(e) => setNewCar({ ...newCar, isAutomatic: e.target.checked })}
              className="mr-2"
            />
            <span>Automatic</span>
          </div>
          <input
            type="number"
            placeholder="Year"
            value={newCar.year || ''}
            onChange={(e) => {
              const year = +e.target.value;
              if (year <= currentYear) {
                setNewCar({ ...newCar, year });
                setError(null);
              } else {
                setError('Year cannot be greater than the current year');
              }
            }}
            className="border border-gray-300 p-2 rounded-md"
          />
          <div className="relative">
            <input
              type="text"
              placeholder="City"
              value={newCar.city || ''}
              onChange={handleCityChangeNewCar}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
            {citySuggestionsNewCar.length > 0 && (
              <ul
                ref={suggestionsRefNewCar}
                className="absolute border border-gray-300 bg-white mt-1 rounded-md w-full max-h-60 overflow-auto z-10"
              >
                {citySuggestionsNewCar.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleCitySelectNewCar(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Error for new city */}
          {cityError && <div className="text-red-500">{cityError}</div>}
          <input
            type="number"
            placeholder="Price"
            value={newCar.price || ''}
            onChange={(e) => setNewCar({ ...newCar, price: +e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newCar.isAvailable || false}
              onChange={(e) => setNewCar({ ...newCar, isAvailable: e.target.checked })}
              className="mr-2"
            />
            <span>Available</span>
          </div>
          <button
            onClick={handleAddCar}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md"
          >
            Add Car
          </button>
        </div>
      </div>
      {editingCar && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Car</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Mark"
              value={editingCar.mark || ''}
              onChange={(e) => setEditingCar({ ...editingCar, mark: e.target.value })}
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Model"
              value={editingCar.model || ''}
              onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={editingCar.capacity || ''}
              onChange={(e) => setEditingCar({ ...editingCar, capacity: +e.target.value })}
              className="border border-gray-300 p-2 rounded-md"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={editingCar.isAutomatic || false}
                onChange={(e) => setEditingCar({ ...editingCar, isAutomatic: e.target.checked })}
                className="mr-2"
              />
              <span>Automatic</span>
            </div>
            <input
              type="number"
              placeholder="Year"
              value={editingCar.year || ''}
              onChange={(e) => {
                const year = +e.target.value;
                if (year <= currentYear) {
                  setEditingCar({ ...editingCar, year });
                  setError(null);
                } else {
                  setError('Year cannot be greater than the current year');
                }
              }}
              className="border border-gray-300 p-2 rounded-md"
            />
            <div className="relative">
              <input
                type="text"
                placeholder="City"
                value={editingCar.city || ''}
                onChange={handleCityChangeEditCar}
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              {citySuggestionsEditCar.length > 0 && (
                <ul
                  ref={suggestionsRefEditCar}
                  className="absolute border border-gray-300 bg-white mt-1 rounded-md w-full max-h-60 overflow-auto z-10"
                >
                  {citySuggestionsEditCar.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleCitySelectEditCar(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {cityError && <div className="text-red-500">{cityError}</div>}
            <input
              type="number"
              placeholder="Price"
              value={editingCar.price || ''}
              onChange={(e) => setEditingCar({ ...editingCar, price: +e.target.value })}
              className="border border-gray-300 p-2 rounded-md"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={editingCar.isAvailable || false}
                onChange={(e) => setEditingCar({ ...editingCar, isAvailable: e.target.checked })}
                className="mr-2"
              />
              <span>Available</span>
            </div>
            <button
              onClick={handleUpdateCar}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
            >
              Update Car
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
