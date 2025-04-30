import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart'
import Orderlist from './pages/Orderlist'
import Home from './pages/Home'
import Login from './pages/Login'


function App() {
  return (
    <div>
      <Navbar />

      <Routes>
      <Route path='/' element={<Home />}></Route>
        <Route path='/Cart' element={<Cart />}></Route>
        <Route path='/Orderlist' element={<Orderlist />}></Route>
        <Route path='/Login' element={<Login />}></Route>
        
        
      </Routes>
    </div>
  )
}

export default App
