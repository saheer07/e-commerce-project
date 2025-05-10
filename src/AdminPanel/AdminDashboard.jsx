import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from './AdminNavbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FaAlignLeft } from "react-icons/fa6";


const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('30');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('http://localhost:3001/users');
        setUsers(usersRes.data);

        const productsRes = await axios.get('http://localhost:3001/products');
        setProducts(productsRes.data);

        const ordersRes = await axios.get('http://localhost:3001/orders'); // Fetch orders
        setOrders(ordersRes.data); // Set orders

      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    fetchData();
  }, []);

  if (loading || !products.length || !users.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p className="text-xl">Loading data...</p>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-red-500 text-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Access Denied</h2>
          <p className="text-lg">You are not authorized to view this page.</p>
        </div>
      </div>
    );
  }

  const availableProducts = products.filter((p) => p.quantity > 0);
  const unavailableProducts = products.filter((p) => p.quantity === 0);
  const activeUsersCount = users.filter(u => !u.isBlocked).length;

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(filter));
    return orderDate >= cutoffDate;
  });

  const totalSalesAmount = filteredOrders.reduce((sum, order) => sum + order.totalSales, 0);

  return (
    <div className="admin-dashboard bg-gradient-to-b from-black to-gray-900 text-white min-h-screen p-6 flex flex-col md:flex-row">
      <AdminNavbar />

      <div className="w-full md:w-3/4 md:pl-8">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-8"> <FaAlignLeft /> Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-8">
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
            <p className="text-2xl font-bold">
              {availableProducts.filter(product => orders.some(o => o.productId === product.id)).length}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-yellow-400 mb-2">Total Sales ($)</h3>
            <p className="text-2xl font-bold">${totalSalesAmount}</p>
          </div>
        </div>

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

        <div className="mb-12">
          <h2 className="text-2xl text-blue-400 mb-4">Sales Chart</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredOrders.map(order => {
                const product = products.find(p => p.id === order.productId);
                return {
                  name: product?.name || 'Unknown',
                  sales: order.totalSales,
                  quantity: order.quantitySold,
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

        <div className="mb-8">
          <h2 className="text-2xl text-red-500 mb-4">Available Products with Sales</h2>
          <table className="min-w-full table-auto text-sm text-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity In Stock</th>
                <th className="px-4 py-2">Quantity Sold</th>
                <th className="px-4 py-2">Total Sales ($)</th>
                <th className="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {availableProducts.map(product => {
                const productOrders = orders.filter(order => order.productId === product.id);
                const totalSold = productOrders.reduce((sum, o) => sum + o.quantitySold, 0);
                const totalRevenue = productOrders.reduce((sum, o) => sum + o.totalSales, 0);

                return (
                  <tr key={product.id} className="bg-gray-800 border-b border-gray-700">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">
                      <img
                        src={product.image || 'https://via.placeholder.com/64'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">${product.price}</td>
                    <td className="px-4 py-2">{product.quantity}</td>
                    <td className="px-4 py-2">{totalSold}</td>
                    <td className="px-4 py-2">${totalRevenue}</td>
                    <td className="px-4 py-2">{product.description || 'No description'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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
              {unavailableProducts.map(product => (
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
