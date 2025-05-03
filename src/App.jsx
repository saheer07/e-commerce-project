import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart'
import Orderlist from './pages/Orderlist'
import Home from './pages/Home'
import Login from './pages/UserRegistration/Login'
import Signup from './pages/UserRegistration/Signup'
import Products from './pages/Products'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Payment from './pages/Payment'
import ProductDetails from './pages/ProductDetails'







function App() {
  return (
    <div>
      <Navbar />

      <Routes>
      <Route path='/' element={<Home />}></Route>
        <Route path='/Cart' element={<Cart />}></Route>
        <Route path='/Orderlist' element={<Orderlist />}></Route>
        <Route path='/Login' element={<Login />}></Route>
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orderlist" element={<Orderlist />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      
      </Routes>
      <ToastContainer />
      
    </div>
  )
}

export default App
