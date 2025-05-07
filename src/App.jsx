import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';
import Orderlist from './pages/Orderlist';
import Home from './pages/Home';
import Login from './pages/UserRegistration/Login';
import Signup from './pages/UserRegistration/Signup';
import Products from './pages/Products';
import Payment from './pages/Payment';
import ProductDetails from './pages/ProductDetails';
import AdminDashboard from './AdminPanel/AdminDashboard';
import ProductManagement from './AdminPanel/ProductManagement';
import OrderManagement from './AdminPanel/OrderManagement';
import UserManagement from './AdminPanel/UserManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';

// ✅ Admin route wrapper
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.isAdmin ? children : <Navigate to="/" replace />;
};

const App = () => {
  const location = useLocation();

  // ❌ Hide navbar on these routes
  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname.startsWith('/admin');

  return (
    <div>
      {/* ✅ Conditional Navbar */}
      {!hideNavbar && <Navbar />}

      {/* ✅ App Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orderlist" element={<Orderlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ✅ Admin Routes with Protection */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <ProductManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <OrderManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
      </Routes>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default App;
