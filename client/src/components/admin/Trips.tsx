import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trip, User, DriverProfile, PassengerProfile } from './types';
import DriversInput from './components/FavoriteDrivers';
import PassengersInput from './components/FavoritePassengers';

const Trips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [passengers, setPassengers] = useState<PassengerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTrip, setNewTrip] = useState<Partial<Trip>>({
    start: '',
    destination: '',
    price: 0,
    numberPassengers: 0,
    description: '',
    driverId: 0,
    passengerId: 0,
  });
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ tripsRes, usersRes, driversRes, passengerRes ] = await Promise.all([
        axios.get('/trip'),
        axios.get('/user'),
        axios.get('/driver'),
        axios.get('/passenger'),
      ]);
      setTrips(tripsRes.data);
      setUsers(usersRes.data);
      setDrivers(driversRes.data);
      setPassengers(passengerRes.data);
      setLoading(false);
      console.log('Trips data:', tripsRes.data)
    } catch (error) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/trip/${id}`);
      setTrips(trips.filter(trip => trip.id !== id));
    } catch (error) {
      setError('Failed to delete trip');
    }
  };

  const handleAddTrip = async () => {
    try {
      const response = await axios.post('/trip', newTrip);
      setTrips([...trips, response.data]);
      setNewTrip({
        start: '',
        destination: '',
        price: 0,
        numberPassengers: 0,
        description: '',
        driverId: 0,
        passengerId: 0,
      });
      fetchData();
    } catch (error) {
      setError('Failed to add trip');
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
  };

  const handleUpdateTrip = async () => {
    if (editingTrip) {
      try {
        await axios.put(`/trip/${editingTrip.id}`, editingTrip);
        setTrips(trips.map(trip => (trip.id === editingTrip.id ? editingTrip : trip)));
        setEditingTrip(null);
        fetchData();
      } catch (error) {
        setError('Failed to update trip');
      }
    }
  };

  const getSelectedDriverProfile = () => {
    return drivers.find(driver => driver.id === newTrip.driverId) || null;
  };

  const getSelectedPassengerProfile = () => {
    return passengers.find(passenger => passenger.id === newTrip.passengerId) || null;
  };

  // Handle valid drivers and passengers for new trip
  const validNewTripDrivers = newTrip.driverId
    ? drivers.filter(driver => driver.id === newTrip.driverId)
    : [];

  const validNewTripPassengers = newTrip.passengerId
    ? passengers.filter(passenger => passenger.id === newTrip.passengerId)
    : [];

  // Handle valid drivers and passengers for editing trip
  const validEditingTripDrivers = editingTrip
    ? drivers.filter(driver => driver.id === editingTrip.driverId)
    : [];

  const validEditingTripPassengers = editingTrip
    ? passengers.filter(passenger => passenger.id === editingTrip.passengerId)
    : [];

  return (
    <div className="container mx-auto py-8 px-4 ml-[4.3rem] overflow-hidden w-100">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Trips</h1>
      {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="w-1/8 px-4 py-2">ID</th>
                <th className="w-1/8 px-4 py-2">Start</th>
                <th className="w-1/8 px-4 py-2">Destination</th>
                <th className="w-1/8 px-4 py-2">Price</th>
                <th className="w-1/8 px-4 py-2">Number of Passengers</th>
                <th className="w-1/8 px-4 py-2">Description</th>
                <th className="w-1/8 px-4 py-2">Driver ID</th>
                <th className="w-1/8 px-4 py-2">Passenger ID</th>
                <th className="w-1/8 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{trip.id}</td>
                  <td className="px-4 py-2">{trip.start}</td>
                  <td className="px-4 py-2">{trip.destination}</td>
                  <td className="px-4 py-2">{trip.price ? `${trip.price.toFixed(2)}MAD` : 'N/A'}</td>
                  <td className="px-4 py-2">{trip.numberPassengers}</td>
                  <td className="px-4 py-2">{trip.description || 'N/A'}</td>
                  <td className="px-4 py-2">{trip.driverId}</td>
                  <td className="px-4 py-2">{trip.passengerId}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md mr-2"
                      onClick={() => handleDelete(trip.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      onClick={() => handleEdit(trip)}
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
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Trip</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Start"
            value={newTrip.start || ''}
            onChange={(e) => setNewTrip({ ...newTrip, start: e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Destination"
            value={newTrip.destination || ''}
            onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Price"
            value={newTrip.price || ''}
            onChange={(e) => setNewTrip({ ...newTrip, price: +e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Number of Passengers"
            value={newTrip.numberPassengers || ''}
            onChange={(e) => setNewTrip({ ...newTrip, numberPassengers: +e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          />
          <textarea
            placeholder="Description"
            value={newTrip.description || ''}
            onChange={(e) => setNewTrip({ ...newTrip, description: e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          />
          <DriversInput
            drivers={drivers}
            users={users}
            allowMultipleSelections={false}
            selectedDrivers={validNewTripDrivers}
            onChange={(selectedDrivers) => {
              setEditingTrip(prev => prev ? { ...prev, driverId: selectedDrivers.length > 0 ? selectedDrivers[0].id : 0 } : null);
              setNewTrip(prev => ({ ...prev, driverId: selectedDrivers.length > 0 ? selectedDrivers[0].id : 0 }));
            }}
          />
          <PassengersInput
            passengers={passengers}
            users={users}
            allowMultipleSelections={false}
            selectedPassengers={validNewTripPassengers}
            onChange={(selectedPassengers) => {
              setEditingTrip(prev => prev ? { ...prev, passengerId: selectedPassengers.length > 0 ? selectedPassengers[0].id : 0 } : null);
              setNewTrip(prev => ({ ...prev, passengerId: selectedPassengers.length > 0 ? selectedPassengers[0].id : 0 }));
            }}
          />
          {/* <DriversInput
            drivers={drivers}
            users={users}
            allowMultipleSelections={false}
            selectedDrivers={newTrip.driverId ? [getSelectedDriverProfile()] : []}
            onChange={(selectedTrips) => setNewTrip({ ...newTrip, driverId: +selectedTrips })}
          /> */}
          {/* <PassengersInput
            passengers={passengers}
            users={users}
            allowMultipleSelections={false}
            selectedPassengers={newTrip.passengerId ? [getSelectedPassengerProfile()] : []}
            onChange={(selectedPassengers) => setNewTrip({ ...newTrip, passengerId: +selectedPassengers })}
          /> */}
          {/* <select
            value={newTrip.driverId || 0}
            onChange={(e) => setNewTrip({ ...newTrip, driverId: +e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value={0}>Select Driver</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>{driver.id}</option>
            ))}
          </select> */}
          {/* <select
            value={newTrip.passengerId || 0}
            onChange={(e) => setNewTrip({ ...newTrip, passengerId: +e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value={0}>Select Passenger</option>
            {passengers.map(passenger => (
              <option key={passenger.id} value={passenger.id}>{passenger.id}</option>
            ))}
          </select> */}
          <button
            onClick={handleAddTrip}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md"
          >
            Add Trip
          </button>
        </div>
      </div>
      {editingTrip && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Trip</h2>
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="Start"
                  value={editingTrip.start || ''}
                  onChange={(e) => setEditingTrip({ ...editingTrip, start: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Destination"
                  value={editingTrip.destination || ''}
                  onChange={(e) => setEditingTrip({ ...editingTrip, destination: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={editingTrip.price || ''}
                  onChange={(e) => setEditingTrip({ ...editingTrip, price: +e.target.value })}
                  className="border border-gray-300 p-2 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Number of Passengers"
                  value={editingTrip.numberPassengers || ''}
                  onChange={(e) => setEditingTrip({ ...editingTrip, numberPassengers: +e.target.value })}
                  className="border border-gray-300 p-2 rounded-md"
                />
                <textarea
                  placeholder="Description"
                  value={editingTrip.description || ''}
                  onChange={(e) => setEditingTrip({ ...editingTrip, description: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md"
                />
                <DriversInput
                  drivers={drivers}
                  users={users}
                  allowMultipleSelections={false}
                  selectedDrivers={validEditingTripDrivers}
                  onChange={(selectedDrivers) => {
                    setEditingTrip(prev => prev ? { ...prev, driverId: selectedDrivers.length > 0 ? selectedDrivers[0].id : 0 } : null);
                    setNewTrip(prev => ({ ...prev, driverId: selectedDrivers.length > 0 ? selectedDrivers[0].id : 0 }));
                  }}
                />
                <PassengersInput
                  passengers={passengers}
                  users={users}
                  allowMultipleSelections={false}
                  selectedPassengers={validEditingTripPassengers}
                  onChange={(selectedPassengers) => {
                    setEditingTrip(prev => prev ? { ...prev, passengerId: selectedPassengers.length > 0 ? selectedPassengers[0].id : 0 } : null);
                    setNewTrip(prev => ({ ...prev, passengerId: selectedPassengers.length > 0 ? selectedPassengers[0].id : 0 }));
                  }}
                />
                {/* <DriversInput
                  drivers={drivers}
                  users={users}
                  allowMultipleSelections={false}
                  selectedDrivers={[editingTrip.driverId as number] || []}
                  onChange={(selectedDriver) => setEditingTrip({ ...editingTrip, driverId: +selectedDriver })}
                />
                <PassengersInput
                  passengers={passengers}
                  users={users}
                  allowMultipleSelections={false}
                  selectedPassengers={[editingTrip.passengerId as number] || []}
                  onChange={(selectedPassenger) => setEditingTrip({ ...editingTrip, passengerId: +selectedPassenger })}
                /> */}
                {/* <select
                  value={editingTrip.driverId || 0}
                  onChange={(e) => setEditingTrip({ ...editingTrip, driverId: +e.target.value })}
                  className="border border-gray-300 p-2 rounded-md"
                >
                  <option value={0}>Select Driver</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>{driver.id}</option>
                  ))}
                </select>
                <select
                  value={editingTrip.passengerId || 0}
                  onChange={(e) => setEditingTrip({ ...editingTrip, passengerId: +e.target.value })}
                  className="border border-gray-300 p-2 rounded-md"
                >
                  <option value={0}>Select Passenger</option>
                  {passengers.map(passenger => (
                    <option key={passenger.id} value={passenger.id}>{passenger.id}</option>
                  ))}
                </select> */}
                <button
                  onClick={handleUpdateTrip}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
                >
                  Update Trip
                </button>
              </div>
            </div>
          )}
        </div>
      );
    };

    export default Trips;
