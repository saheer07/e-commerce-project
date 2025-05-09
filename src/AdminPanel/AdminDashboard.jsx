import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from './AdminNavbar';


const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
        ];
        setUsers(usersData);

        const response = await axios.get('http://localhost:3001/products');
        setProducts(response.data);

        const salesData = [
          { productId: 1, quantitySold: 10, totalSales: 2000 },
          { productId: 2, quantitySold: 5, totalSales: 1250 },
        ];
        setSales(salesData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

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

  const unavailableProducts = products.filter((product) => product.quantity === 0);

  return (
    <div className="admin-dashboard bg-gradient-to-b from-black to-gray-900 text-white min-h-screen p-6 flex flex-col md:flex-row">
      {/* Sidebar Navbar */}
      <AdminNavbar />

      {/* Dashboard Content */}
      <div className="w-full md:w-3/4 md:pl-8">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-8">Admin Dashboard</h1>

        {/* Product Availability */}
        <div className="mb-8">
          <h2 className="text-2xl text-red-500 mb-4">Available Products</h2>
          <table className="min-w-full table-auto text-sm text-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="bg-gray-800">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">${product.price}</td>
                  <td className="px-4 py-2">{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Unavailable Products */}
        <div className="mb-8">
          <h2 className="text-2xl text-yellow-500 mb-4">Unavailable Products</h2>
          <table className="min-w-full table-auto text-sm text-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {unavailableProducts.map((product) => (
                <tr key={product.id} className="bg-gray-800">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">${product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sales Summary */}
        <div className="mb-8">
          <h2 className="text-2xl text-red-500 mb-4">Sales Summary</h2>
          <table className="min-w-full table-auto text-sm text-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Quantity Sold</th>
                <th className="px-4 py-2">Total Sales ($)</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => {
                const product = products.find((p) => p.id === sale.productId);
                return (
                  <tr key={sale.productId} className="bg-gray-800">
                    <td className="px-4 py-2">{product?.name || 'Unknown Product'}</td>
                    <td className="px-4 py-2">{sale.quantitySold}</td>
                    <td className="px-4 py-2">${sale.totalSales}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
