import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DriverProfile, PassengerProfile, Trip, User } from './types';
// import FavoriteCars from './components/FavoriteCars';
import FavoriteDrivers from './components/FavoriteDrivers';
import Trips from './components/TripsSelection';

const Passengers: React.FC = () => {
  const [passengers, setPassengers] = useState<PassengerProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newPassenger, setNewPassenger] = useState<Partial<PassengerProfile>>({
    userId: 0,
    photo: '',
    biography: '',
    favorite_drivers: [],
    favorite_of_drivers: [],
    trips: [],
  });
  const [editingPassenger, setEditingPassenger] = useState<PassengerProfile | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ passengerRes, usersRes, driversRes, tripsRes ] = await Promise.all([
        axios.get('/passenger'),
        axios.get('/user'),
        axios.get('/driver'),
        axios.get('/trip'),
      ]);
      setPassengers(passengerRes.data);
      setUsers(usersRes.data);
      setDrivers(driversRes.data);
      setTrips(tripsRes.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/passenger/${id}`);
      setPassengers(passengers.filter(passenger => passenger.id !== id));
    } catch (error) {
      setError('Failed to delete passenger');
    }
  };

  const handleAddPassenger = async () => {
    try {
      console.log('passengers data:', newPassenger)
      console.log('trip data:', newPassenger.trips)
      console.log('driver data:', newPassenger.favorite_drivers)
      const response = await axios.post('/passenger', {
        ...newPassenger,
        favorite_drivers: newPassenger.favorite_drivers?.map(driver => Number(driver.id)) || [],
        trips: newPassenger.trips?.map(trip => Number(trip.id)) || [],
      });
      setPassengers([...passengers, response.data]);
      setNewPassenger({
        userId: 0,
        photo: '',
        biography: '',
        favorite_drivers: [],
        favorite_of_drivers: [],
        trips: [],
      });
      fetchData();
    } catch (error) {
      setError('Failed to add passenger');
    }
  };

  const handleEdit = (passenger: PassengerProfile) => {
    setEditingPassenger(passenger);
  };

  const handleUpdatePassenger = async () => {
    if (editingPassenger) {
      try {
        await axios.put(`/passenger/${editingPassenger.id}`, {
          ...editingPassenger,
          favorite_drivers: editingPassenger.favorite_drivers?.map(driver => Number(driver.id)) || [],
          trips: editingPassenger.trips?.map(trip => Number(trip.id)) || [],
        });
        setPassengers(passengers.map(passenger => (passenger.id === editingPassenger.id ? editingPassenger : passenger)));
        setEditingPassenger(null);
        fetchData();
      } catch (error) {
        setError('Failed to update passenger');
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 ml-20">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Passengers</h1>
      {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="w-1/6 px-4 py-2">ID</th>
                <th className="w-1/6 px-4 py-2">User ID</th>
                <th className="w-1/6 px-4 py-2">Photo</th>
                <th className="w-1/6 px-4 py-2">Biography</th>
                <th className="w-1/6 px-4 py-2">Favorite Drivers</th>
                <th className="w-1/6 px-4 py-2">Trips</th>
                <th className="w-1/6 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map(passenger => (
                <tr key={passenger.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{passenger.id}</td>
                  <td className="px-4 py-2">{passenger.userId}</td>
                  <td className="px-4 py-2">
                    {passenger.photo ? <img src={passenger.photo} alt="Passenger Photo" className="w-16 h-16 object-cover rounded-full" /> : 'N/A'}
                  </td>
                  <td className="px-4 py-2">{passenger.biography}</td>
                  <td className="px-4 py-2">
                    {passenger.favorite_drivers?.length ?
                      (passenger.favorite_drivers as Partial<DriverProfile>[])
                      .map(driver => driver.id)
                      .join(', ')
                      : 'None'
                    }
                  </td>
                  <td className="px-4 py-2">
                    {passenger.trips?.length ?
                      (passenger.trips as Partial<Trip>[])
                      .map(trip => trip.id)
                      .join(', ')
                      : 'None'
                    }
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md mr-2"
                      onClick={() => handleDelete(passenger.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      onClick={() => handleEdit(passenger)}
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
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Passenger</h2>
        <div className="flex flex-col space-y-4">
          <label htmlFor="userId">Select User</label>
          <select
            id="userId"
            value={newPassenger.userId || 0}
            onChange={(e) => setNewPassenger({ ...newPassenger, userId: Number(e.target.value) })}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value={0}>Select a User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{`${user.id} - ${user.username}`}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Photo URL"
            value={newPassenger.photo || ''}
            onChange={(e) => setNewPassenger({ ...newPassenger, photo: e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          />
          <textarea
            placeholder="Biography"
            value={newPassenger.biography || ''}
            onChange={(e) => setNewPassenger({ ...newPassenger, biography: e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          />
          <FavoriteDrivers
            drivers={drivers}
            users={users}
            allowMultipleSelections={true}
            selectedDrivers={newPassenger.favorite_drivers || []}
            onChange={(selectedDrivers) => setNewPassenger({ ...newPassenger, favorite_drivers: selectedDrivers })}
          />
          <Trips
            trips={trips}
            selectedTrips={newPassenger.trips || []}
            onChange={(selectedTrips) => setNewPassenger({ ...newPassenger, trips: selectedTrips })}
          />
          <button
            onClick={handleAddPassenger}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md"
          >
            Add Passenger
          </button>
        </div>
      </div>
      {editingPassenger && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Passenger</h2>
          <div className="flex flex-col space-y-4">
            <label htmlFor="userId">Select User</label>
            <select
              id="userId"
              value={editingPassenger.userId || 0}
              onChange={(e) => setEditingPassenger({ ...editingPassenger, userId: Number(e.target.value) })}
              className="border border-gray-300 p-2 rounded-md"
            >
              <option value={0}>Select a User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{`${user.id} - ${user.username}`}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Photo URL"
              value={editingPassenger.photo || ''}
              onChange={(e) => setEditingPassenger({ ...editingPassenger, photo: e.target.value })}
              className="border border-gray-300 p-2 rounded-md"
            />
            <textarea
              placeholder="Biography"
              value={editingPassenger.biography || ''}
              onChange={(e) => setEditingPassenger({ ...editingPassenger, biography: e.target.value })}
              className="border border-gray-300 p-2 rounded-md"
            />
            <FavoriteDrivers
              drivers={drivers}
              users={users}
              allowMultipleSelections={true}
              selectedDrivers={editingPassenger.favorite_drivers || []}
              onChange={(selectedDrivers) => setEditingPassenger({ ...editingPassenger, favorite_drivers: selectedDrivers })}
            />
            <Trips
              trips={trips}
              selectedTrips={editingPassenger.trips || []}
              onChange={(selectedTrips) => setEditingPassenger({ ...editingPassenger, trips: selectedTrips })}
            />
            <button
              onClick={handleUpdatePassenger}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
            >
              Update Passenger
            </button>
            <button
              onClick={() => setEditingPassenger(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Passengers;
