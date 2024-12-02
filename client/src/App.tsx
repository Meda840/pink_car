import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Users components
import Navbar from './components/Navbar';
import Homepage from './pages/HomePage';

// Admin components 
import AdminNavbar from './components/admin/AdminNavBar';
import Users from './components/admin/Users';
import Cars from './components/admin/Cars';
import Drivers from './components/admin/Drivers';
import Passengers from './components/admin/Passengers';
import Trips from './components/admin/Trips';

// Define all your components for different routes
const Dashboard = () => <div>Dashboard Page</div>;
const About = () => <div>About Page</div>;
const Contact = () => <div>Contact Page</div>;
const Login = () => <div>Admin Login Page</div>;

const App: React.FC = () => {
  const location = useLocation();

  // Determine if the path includes '/admin'
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div>
      {/* Render the appropriate navbar based on the route */}
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}

      {/* Use Routes instead of Switch */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/cars" element={<Cars />} />
        <Route path="/admin/drivers" element={<Drivers />} />
        <Route path="/admin/passengers" element={<Passengers />} />
        <Route path="/admin/trips" element={<Trips />} />
      </Routes>
    </div>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
