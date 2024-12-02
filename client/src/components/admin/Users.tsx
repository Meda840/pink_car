import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from './types';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Helper function to replace empty strings with null
const convertEmptyStringsToNull = (data: any) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
  );
};

// Helper function to validate email addresses
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone number (basic validation for demo purposes)
const isValidPhoneNumber = (phoneNumber: string) => {
  // Ensures the phone number is at least 10 digits long
  return phoneNumber && phoneNumber.length >= 10;
};

// Define the Users component
const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    identity: '',
    username: '',
    password: '',
    email: '',
    phone_number: '',
    role: false,
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/user');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/user/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  const handleAddUser = async () => {
    // Email validation check
    if (newUser.email && !isValidEmail(newUser.email)) {
      setError('Invalid email format');
      return;
    }
    // Phone number validation check
    if (newUser.phone_number && !isValidPhoneNumber(newUser.phone_number)) {
      setError('Invalid phone number');
      return;
    }
    try {
      // Convert empty strings to null before sending data
      const userData = convertEmptyStringsToNull(newUser);
      await axios.post('/user/register', userData);
      setNewUser({
        identity: '',
        username: '',
        password: '',
        email: '',
        phone_number: '',
        role: false,
      });
      fetchUsers();
    } catch (error) {
      setError('Failed to add user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      // Email validation check
      if (editingUser.email && !isValidEmail(editingUser.email)) {
        setError('Invalid email format');
        return;
      }
      // Phone number validation check
      if (editingUser.phone_number && !isValidPhoneNumber(editingUser.phone_number)) {
        setError('Invalid phone number');
        return;
      }

      try {
        // Convert empty strings to null before updating data
        const userData = convertEmptyStringsToNull(editingUser);
        await axios.put(`/user/${editingUser.id}`, userData);
        setEditingUser(null);
        fetchUsers();
      } catch (error) {
        setError('Failed to update user');
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 ml-[4.3rem]">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Users</h1>
      {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-pink-500 text-white">
              <tr>
                <th className="w-1/6 px-4 py-2">ID</th>
                <th className="w-1/6 px-4 py-2">Identity</th>
                <th className="w-1/6 px-4 py-2">Username</th>
                <th className="w-1/6 px-4 py-2">Email</th>
                <th className="w-1/6 px-4 py-2">Phone Number</th>
                <th className="w-1/6 px-4 py-2">Role</th>
                <th className="w-1/6 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.identity}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone_number}</td>
                  <td className="px-4 py-2">{user.role ? 'Admin' : 'User'}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md mr-2"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      onClick={() => handleEdit(user)}
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
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New User</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Identity"
            value={newUser.identity || ''}
            onChange={(e) => setNewUser({ ...newUser, identity: e.target.value })}
            required
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Username"
            value={newUser.username || ''}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password || ''}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email || ''}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            className="border border-gray-300 p-2 rounded-md"
          />
          <PhoneInput
            country={'ma'} // Default country code
            value={newUser.phone_number || ''}
            onChange={(value) => setNewUser({ ...newUser, phone_number: value })}
            placeholder="Phone Number"
            inputClass="border border-gray-300 p-2 rounded-md w-full"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newUser.role || false}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.checked })}
              className="mr-2"
            />
            <span>Admin Role</span>
          </div>
          <button
            onClick={handleAddUser}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md"
          >
            Add User
          </button>
        </div>
      </div>
      {editingUser && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Edit User</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Identity"
              onChange={(e) => setEditingUser({ ...editingUser, identity: e.target.value })}
              required
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
              required
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
              required
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              required
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              onChange={(e) => setEditingUser({ ...editingUser, phone_number: e.target.value })}
              required
              className="border border-gray-300 p-2 rounded-md"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={editingUser.role || false}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.checked })}
                className="mr-2"
              />
              <span>Admin Role</span>
            </div>
            <button
              onClick={handleUpdateUser}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
            >
              Update User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
