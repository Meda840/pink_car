import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav
      className={`bg-pink-500 text-white shadow-lg fixed h-screen transition-all duration-300 z-10  ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col justify-start items-center py-6 space-y-6">
        <div className="flex items-center justify-center w-full">
          <span className={`text-2xl font-bold transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            Admin Panel
          </span>
        </div>
        <ul className="flex flex-col space-y-4 w-full">
          <li>
            <Link
              to="/admin/dashboard"
              className="hover:bg-pink-600 hover:text-gray-200 px-3 py-2 rounded-md block text-center transition-all duration-300"
            >
              <span className="block text-2xl">&#128203;</span>
              {isExpanded && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="hover:bg-pink-600 hover:text-gray-200 px-3 py-2 rounded-md block text-center transition-all duration-300"
            >
              <span className="block text-2xl">&#128101;</span>
              {isExpanded && <span>Users</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/cars"
              className="hover:bg-pink-600 hover:text-gray-200 px-3 py-2 rounded-md block text-center transition-all duration-300"
            >
              <span className="block text-2xl">&#128663;</span>
              {isExpanded && <span>Cars</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/drivers"
              className="hover:bg-pink-600 hover:text-gray-200 px-3 py-2 rounded-md block text-center transition-all duration-300"
            >
              <span className="block text-2xl">&#128104;</span>
              {isExpanded && <span>Drivers</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/passengers"
              className="hover:bg-pink-600 hover:text-gray-200 px-3 py-2 rounded-md block text-center transition-all duration-300"
            >
              <span className="block text-2xl">&#128694;</span>
              {isExpanded && <span>Passengers</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/trips"
              className="hover:bg-pink-600 hover:text-gray-200 px-3 py-2 rounded-md block text-center transition-all duration-300"
            >
              <span className="block text-2xl">&#128649;</span>
              {isExpanded && <span>Trips</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
