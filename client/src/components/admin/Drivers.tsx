import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DriverProfile, User, Car, Trip, PassengerProfile } from './types';
import FavoriteCars from './components/FavoriteCars';
import FavoritePassengers from './components/FavoritePassengers';
import Trips from './components/TripsSelection';
import MapModal from './components/MapModal';


const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [passengers, setPassengers] = useState<PassengerProfile[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newDriver, setNewDriver] = useState<Partial<DriverProfile>>({
    userId: 0,
    drivingLicence: '',
    photo: '',
    biography: '',
    location: '',
    favorite_cars: [],
    favorite_passengers: [],
    trips: [],
  });
  const [editingDriver, setEditingDriver] = useState<DriverProfile | null>(null);

  useEffect(() => {
    fetchData();

    ////
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) && 
        !document.querySelector('.leaflet-container')?.contains(event.target as Node)
      ) {
        setIsMapModalOpen(false);
        setIsEditMapModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [carsRes, passengersRes, tripsRes, driversRes, usersRes] = await Promise.all([
        axios.get('/car'),
        axios.get('/passenger'),
        axios.get('/trip'),
        axios.get('/driver'),
        axios.get('/user')
      ]);
      setCars(carsRes.data);
      setPassengers(passengersRes.data);
      setTrips(tripsRes.data);
      setDrivers(driversRes.data);
      setUsers(usersRes.data);
      setLoading(false);
      console.log('drivers data:', driversRes.data);
    } catch (error) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  ////
  // const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isEditMapModalOpen, setIsEditMapModalOpen] = useState(false); // Separate modal for editing location
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLocationSelect = (coordinates: { lat: number; lon: number }) => {
    // setLocation(coordinates);
    setNewDriver({ ...newDriver, location: `${coordinates.lat}, ${coordinates.lon}` });
    setIsMapModalOpen(false); // Close the modal after selecting location
  };

  const handleEditLocationSelect = (coordinates: { lat: number; lon: number }) => {
    if (editingDriver) {
      setEditingDriver({ ...editingDriver, location: `${coordinates.lat}, ${coordinates.lon}` });
      setIsEditMapModalOpen(false); // Close the modal after selecting location for edit
    }
  };

  const handleLocationClick = () => {
    setIsMapModalOpen(true);
  };

  const handleEditLocationClick = () => {
    setIsEditMapModalOpen(true); // Open modal for edit location
  };

  

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/driver/${id}`);
      setDrivers(drivers.filter(driver => driver.id !== id));
    } catch (error) {
      setError('Failed to delete driver');
    }
  };

  const handleAddDriver = async () => {
    try {
      const response = await axios.post('/driver', {
        ...newDriver,
        favorite_cars: newDriver.favorite_cars?.map(car => Number(car.id)) || [],
        favorite_passengers: newDriver.favorite_passengers?.map(passenger => Number(passenger.id)) || [],
        trips: newDriver.trips?.map(trip => Number(trip.id)) || [],
      });
      if (newDriver) {
        console.log(newDriver.favorite_cars?.map(car => car.id));
        console.log(newDriver.favorite_passengers?.map(car => car.id));
        console.log(newDriver.trips?.map(car => car.id));
      }
      setDrivers([...drivers, response.data]);
      setNewDriver({
        userId: 0,
        drivingLicence: '',
        photo: '',
        biography: '',
        location: '',
        favorite_cars: [],
        favorite_passengers: [],
        trips: [],
      });
      fetchData(); // Re-fetch data after adding a driver
    } catch (error) {
      setError('Failed to add driver');
    }
  };

  const handleEdit = (driver: DriverProfile) => {
    setEditingDriver(driver);
  };

  const handleUpdateDriver = async () => {
    if (editingDriver) {
      try {
        await axios.put(`/driver/${editingDriver.id}`, {
          ...editingDriver,
          favorite_cars: editingDriver.favorite_cars?.map(car => Number(car.id)) || [],
          favorite_passengers: editingDriver.favorite_passengers?.map(passenger => Number(passenger.id)) || [],
          trips: editingDriver.trips?.map(trip => Number(trip.id)) || [],
        });
        setDrivers(drivers.map(driver => (driver.id === editingDriver.id ? editingDriver : driver)));
        setEditingDriver(null);
        fetchData();
      } catch (error) {
        setError('Failed to update driver');
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Drivers</h1>
      {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="w-1/6 px-4 py-2">ID</th>
                <th className="w-1/6 px-4 py-2">User</th>
                <th className="w-1/6 px-4 py-2">Driving Licence</th>
                <th className="w-1/6 px-4 py-2">Photo</th>
                <th className="w-1/6 px-4 py-2">Biography</th>
                <th className="w-1/6 px-4 py-2">Location</th>
                <th className="w-1/6 px-4 py-2">Favorite Cars</th>
                <th className="w-1/6 px-4 py-2">Favorite Passengers</th>
                <th className="w-1/6 px-4 py-2">Trips</th>
                <th className="w-1/6 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(driver => (
                <tr key={driver.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{driver.id}</td>
                  <td className="px-4 py-2">
                    {users.find(user => user.id === driver.userId)?.username || 'Unknown'}
                  </td>
                  <td className="px-4 py-2">{driver.drivingLicence}</td>
                  <td className="px-4 py-2">
                    {driver.photo ? <img src={driver.photo} alt="Driver Photo" className="w-16 h-16 object-cover rounded-full" /> : 'N/A'}
                  </td>
                  <td className="px-4 py-2">{driver.biography}</td>
                  <td className="px-4 py-2">{driver.location}</td>
                  <td className="px-4 py-2">
                    {driver.favorite_cars?.length ?
                      (driver.favorite_cars as Partial<Car>[])  // Type assertion to treat favorite_cars as Partial<Car>[]
                      .map(car => car.id)  // Extract the id from each Car object
                      .join(', ')  // Join the IDs into a comma-separated string
                      : 'None'
                    }
                  </td>
                  <td className="px-4 py-2">
                    {driver.favorite_passengers?.length ?
                      (driver.favorite_passengers as Partial<PassengerProfile>[])
                      .map(passenger => passenger.id)
                      .join(', ')
                      : 'None'
                    }
                  </td>
                  <td className="px-4 py-2">
                    {driver.trips?.length ?
                      (driver.trips as Partial<Trip>[])
                      .map(trip => trip.id)
                      .join(', ')
                      : 'None'
                    }
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md mr-2"
                      onClick={() => handleDelete(driver.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      onClick={() => handleEdit(driver)}
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
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Driver</h2>
        <div className="flex flex-col space-y-4">
          {/* <label htmlFor="userId" className="block text-sm font-medium text-gray-700">Select User</label> */}
          <select
            id="userId"
            value={newDriver.userId || 0}
            onChange={(e) => setNewDriver({ ...newDriver, userId: Number(e.target.value) })}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value={0}>Select User ID</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{`${user.id} - ${user.username}`}</option>
            ))}
          </select>
          <div>
            <label htmlFor="licence" className="block text-sm font-medium text-gray-700">Driving Licence</label>
            <input
              type="text"
              placeholder="Driving Licence"
              value={newDriver.drivingLicence || ''}
              onChange={(e) => setNewDriver({ ...newDriver, drivingLicence: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div>
          <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="text"
              placeholder="Photo URL"
              value={newDriver.photo || ''}
              onChange={(e) => setNewDriver({ ...newDriver, photo: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="biography" className="block text-sm font-medium text-gray-700">Biography</label>
            <textarea
              placeholder="Biography"
              value={newDriver.biography || ''}
              onChange={(e) => setNewDriver({ ...newDriver, biography: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Driver Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Clicker pour choisir une localisation"
              ref={inputRef}
              value={newDriver.location || ''}
              onClick={handleLocationClick}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              readOnly
            />
            {isMapModalOpen && (
              <MapModal 
                onLocationSelect={handleLocationSelect}
                onClose={() => setIsMapModalOpen(false)}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Favorite Cars</label>
            <FavoriteCars
              cars={cars}
              selectedCars={newDriver.favorite_cars || []}
              onChange={(selectedCars) => setNewDriver({ ...newDriver, favorite_cars: selectedCars })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Favorite Passengers</label>
            <FavoritePassengers
              passengers={passengers}
              users={users}
              allowMultipleSelections={true}
              selectedPassengers={newDriver.favorite_passengers || []}
              onChange={(selectedPassengers) => setNewDriver({ ...newDriver, favorite_passengers: selectedPassengers })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Trips</label>
            <Trips
              trips={trips}
              selectedTrips={newDriver.trips || []}
              onChange={(selectedTrips) => setNewDriver({ ...newDriver, trips: selectedTrips })}
            />
          </div>
          <button
            onClick={handleAddDriver}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Add Driver
          </button>
        </div>
      </div>
      {editingDriver && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Driver</h2>
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="licence" className="block text-sm font-medium text-gray-700">Driving Licence</label>
              <input
                id="licence"
                type="text"
                placeholder="Driving Licence"
                value={editingDriver.drivingLicence || ''}
                onChange={(e) => setEditingDriver({ ...editingDriver, drivingLicence: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                id="picture"
                type="text"
                placeholder="Photo URL"
                value={editingDriver.photo || ''}
                onChange={(e) => setEditingDriver({ ...editingDriver, photo: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="biography" className="block text-sm font-medium text-gray-700">Biography</label>
              <textarea
                id="biography"
                placeholder="Biography"
                value={editingDriver.biography || ''}
                onChange={(e) => setEditingDriver({ ...editingDriver, biography: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700">Edit Location</label>
              <input
                type="text"
                id="edit-location"
                placeholder="Clicker pour choisir une localisation"
                value={editingDriver.location || ''}
                onClick={handleEditLocationClick}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                readOnly
              />
              {isEditMapModalOpen && (
                <MapModal 
                  onLocationSelect={handleEditLocationSelect}
                  onClose={() => setIsEditMapModalOpen(false)}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Favorite Cars</label>
              <FavoriteCars
                cars={cars}
                selectedCars={editingDriver.favorite_cars || []}
                onChange={(selectedCars) => setEditingDriver({ ...editingDriver, favorite_cars: selectedCars })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Favorite Passengers</label>
              <FavoritePassengers
                passengers={passengers}
                users={users}
                allowMultipleSelections={true}
                selectedPassengers={editingDriver.favorite_passengers || []}
                onChange={(selectedPassengers) => setEditingDriver({ ...editingDriver, favorite_passengers: selectedPassengers })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trips</label>
              <Trips
                trips={trips}
                selectedTrips={editingDriver.trips || []}
                onChange={(selectedTrips) => setEditingDriver({ ...editingDriver, trips: selectedTrips })}
              />
            </div>
            <button
              onClick={handleUpdateDriver}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Update Driver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
