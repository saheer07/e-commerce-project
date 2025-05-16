import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orderlist from './pages/Orderlist';
import Login from './pages/UserRegistration/Login';
import Signup from './pages/UserRegistration/Signup';
import Products from './pages/Products';
import Payment from './pages/Payment';
import ProductDetails from './pages/ProductDetails';

import AdminDashboard from './AdminPanel/AdminDashboard';
import ProductManagement from './AdminPanel/ProductManagement';
import UserManagement from './AdminPanel/UserManagement';
import TrashbinManagement from './AdminPanel/TrashbinManagement';

import About from './Footersection/About';
import Contact from './Footersection/Contact';
import PrivacyPolicy from './Footersection/PrivacyPolicy';
import Terms from './Footersection/Terms';

import { useAuth } from './context/AuthContext';

// ✅ Admin route protection
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.isAdmin ? children : <Navigate to="/" replace />;
};

const App = () => {
  const location = useLocation();

  // ❌ Hide navbar on login, signup, and admin pages
  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname.startsWith('/admin');

  return (
    <div>
      {/* ✅ Conditional Navbar */}
      {!hideNavbar && <Navbar />}

      {/* ✅ Application Routes */}
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
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

        {/* ✅ Protected Admin Routes */}
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
          path="/admin/trashbin"
          element={
            <AdminRoute>
              <TrashbinManagement />
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

      {/* ✅ Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default App;
