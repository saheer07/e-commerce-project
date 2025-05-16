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
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:3001/users'),
          axios.get('http://localhost:3001/products'),
          axios.get('http://localhost:3001/orders')
        ]);

        setUsers(usersRes.data);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-red-500">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (loading) {
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

  const availableProducts = products.filter(p => p.quantity > 0 || p.stock > 0);
  const activeUsersCount = users.filter(u => !u.isBlocked).length;

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date || order.createdAt || order.orderDate);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(filter));
    return orderDate >= cutoffDate;
  });

  const processSalesData = () => {
    const salesByProduct = {};
    
    // Process all orders, not just filtered ones for accurate product stats
    orders.forEach(order => {
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach(item => {
          const productId = item.productId || item.product?.id || item.product;
          if (productId) {
            if (!salesByProduct[productId]) {
              salesByProduct[productId] = {
                productId,
                name: products.find(p => p.id === productId)?.name || 'Unknown',
                sales: 0,
                quantity: 0
              };
            }
            salesByProduct[productId].sales += (item.price || 0) * (item.quantity || 1);
            salesByProduct[productId].quantity += item.quantity || 1;
          }
        });
      } else {
        // Handle single product orders
        const productId = order.id;
        if (productId) {
          if (!salesByProduct[productId]) {
            salesByProduct[productId] = {
              productId,
              name: order.name || 'Unknown',
              sales: 0,
              quantity: 0
            };
          }
          salesByProduct[productId].sales += (order.price || 0) * (order.quantity || 1);
          salesByProduct[productId].quantity += order.quantity || 1;
        }
      }
    });
    
    return Object.values(salesByProduct);
  };

  const salesData = processSalesData();

  const availableProductsWithSales = availableProducts.map(product => {
    const salesEntry = salesData.find(s => s.productId === product.id);
    return {
      productId: product.id,
      name: product.name,
      sales: salesEntry?.sales || 0,
      quantity: salesEntry?.quantity || 0,
      image: product.image,
      price: product.price,
      stock: product.quantity || product.stock || 0
    };
  });

  const chartData = availableProductsWithSales.map(product => ({
    name: product.name.length > 12 ? `${product.name.substring(0, 12)}...` : product.name,
    sales: product.sales,
    quantity: product.quantity,
  }));

  const totalSalesAmount = availableProductsWithSales.reduce(
    (sum, product) => sum + product.sales,
    0
  );

  return (
    <div className="admin-dashboard bg-gradient-to-b from-black to-gray-900 text-white min-h-screen p-6 flex flex-col md:flex-row">
      <AdminNavbar />

      <div className="w-full md:w-3/4 md:pl-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-4xl font-bold text-red-500">
            <FaAlignLeft className="inline-block mr-2" />
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-xl text-red-400 mb-2">Total Users</h3>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-xl text-blue-400 mb-2">Active Users</h3>
            <p className="text-2xl font-bold">{activeUsersCount}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-xl text-green-400 mb-2">Available Products</h3>
            <p className="text-2xl font-bold">{availableProducts.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-xl text-yellow-400 mb-2">Total Sales ($)</h3>
            <p className="text-2xl font-bold">${totalSalesAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-blue-400">Sales Overview</h2>
          <select
            className="bg-gray-800 text-white p-2 rounded-md border border-gray-600"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="0">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>

        <div className="mb-12">
          <div className="bg-gray-800 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  stroke="#fff"
                />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderColor: '#4b5563',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#f87171" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quantity" fill="#34d399" name="Quantity Sold" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl text-red-500 mb-4">Available Products with Sales</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full text-sm text-white">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">In Stock</th>
                  <th className="px-4 py-3 text-right">Sold</th>
                  <th className="px-4 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {availableProductsWithSales.map(product => (
                  <tr key={product.productId} className="border-b border-gray-700 hover:bg-gray-800">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">
                      <img
                        src={product.image || 'https://via.placeholder.com/64'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">${product.price?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-3 text-right">{product.stock}</td>
                    <td className="px-4 py-3 text-right">{product.quantity}</td>
                    <td className="px-4 py-3 text-right">${product.sales.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Recent Orders Section */}
        <div className="mb-8">
          <h2 className="text-2xl text-yellow-400 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full text-sm text-white">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Total ($)</th>
                  <th className="px-4 py-3 text-right">Items</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice(0, 10).map(order => (
                  <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-800">
                    <td className="px-4 py-3">{order.id}</td>
                    <td className="px-4 py-3">{order.user?.name || order.customer || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      {new Date(order.date || order.createdAt || order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${order.total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {Array.isArray(order.products) ? order.products.reduce((acc, item) => acc + (item.quantity || 1), 0) : 1}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
