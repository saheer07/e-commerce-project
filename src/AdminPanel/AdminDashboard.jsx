import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  // If the user is not an admin, show the access denied message
  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center text-red-500">
          <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
          <p className="text-lg">You do not have access to this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard bg-black text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center text-red-500 mb-8">Admin Dashboard</h1>
      
      <div className="admin-links space-y-6">
        <Link
          to="/admin/products"
          className="block text-lg text-red-500 hover:text-red-340 transition duration-300 p-4 rounded-xl bg-gray-950 hover:bg-gray-800 shadow-lg"
        >
          Manage Products
        </Link>
        <Link
          to="/admin/orders"
          className="block text-lg text-red-500 hover:text-red-360 transition duration-300 p-4 rounded-xl bg-gray-950 hover:bg-gray-800 shadow-lg"
        >
          Manage Orders
        </Link>
        <Link
          to="/admin/users"
          className="block text-lg text-red-500 hover:text-red-380 transition duration-300 p-4 rounded-xl bg-gray-950 hover:bg-gray-800 shadow-lg"
        >
          Manage Users
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
