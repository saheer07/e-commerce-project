import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from './AdminNavbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState('30'); // default: last 30 days

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Users
        const usersResponse = await axios.get('http://localhost:3001/users');
        setUsers(usersResponse.data);

        // Products
        const productsResponse = await axios.get('http://localhost:3001/products');
        setProducts(productsResponse.data);

        // Simulated Sales
        const today = new Date();
        const generateDate = (daysAgo) => {
          const date = new Date();
          date.setDate(today.getDate() - daysAgo);
          return date.toISOString();
        };

        const salesData = [
          { productId: 1, quantitySold: 10, totalSales: 2000, date: generateDate(0) },
          { productId: 2, quantitySold: 5, totalSales: 1250, date: generateDate(1) },
          { productId: 1, quantitySold: 3, totalSales: 600, date: generateDate(8) },
          { productId: 2, quantitySold: 2, totalSales: 500, date: generateDate(15) },
          { productId: 1, quantitySold: 7, totalSales: 1400, date: generateDate(29) },
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

  const unavailableProducts = products.filter((p) => p.quantity === 0);
  const availableProductsCount = products.filter(p => p.quantity > 0).length;
  const activeUsersCount = users.filter(user => user.isBlocked === false).length;

  // Filter sales
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    const now = new Date();
    const daysAgo = parseInt(filter);
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - daysAgo);
    return saleDate >= pastDate;
  });

  const totalSalesAmount = filteredSales.reduce((sum, sale) => sum + sale.totalSales, 0);

  return (
    <div className="admin-dashboard bg-gradient-to-b from-black to-gray-900 text-white min-h-screen p-6 flex flex-col md:flex-row">
      <AdminNavbar />

      <div className="w-full md:w-3/4 md:pl-8">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-8">Admin Dashboard</h1>

        {/* Summary Boxes */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-red-400 mb-2">Total Users</h3>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-blue-400 mb-2">Active Users</h3>
            <p className="text-2xl font-bold">{activeUsersCount}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-green-400 mb-2">Available Products</h3>
            <p className="text-2xl font-bold">{availableProductsCount}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-yellow-400 mb-2">Total Sales ($)</h3>
            <p className="text-2xl font-bold">${totalSalesAmount}</p>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="mb-6 flex justify-end">
          <select
            className="bg-gray-800 text-white p-2 rounded-md border border-gray-600"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="0">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
        </div>

        {/* Sales Chart */}
        <div className="mb-12">
          <h2 className="text-2xl text-blue-400 mb-4">Sales Chart</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredSales.map(sale => {
                const product = products.find(p => p.id === sale.productId);
                return {
                  name: product?.name || 'Unknown',
                  sales: sale.totalSales,
                  quantity: sale.quantitySold,
                };
              })}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#f87171" name="Sales ($)" />
                <Bar dataKey="quantity" fill="#34d399" name="Quantity Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Available Products */}
        <div className="mb-8">
          <h2 className="text-2xl text-red-500 mb-4">Available Products</h2>
          <table className="min-w-full table-auto text-sm text-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {products.filter(product => product.quantity > 0).map((product) => (
                <tr key={product.id} className="bg-gray-800">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">
                    <img
                      src={product.image || 'default-image-url'} // Provide a fallback image
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">${product.price}</td>
                  <td className="px-4 py-2">{product.quantity}</td>
                  <td className="px-4 py-2">{product.description || 'No description available'}</td>
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

      </div>
    </div>
  );
};

export default AdminDashboard;
