import React, { useState } from 'react';
import { IoSearchOutline, IoReorderFour } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { FiLogIn } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { FaHome } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* 🔴 Brand + Menu Icon */}
        <div className="w-full flex items-center justify-between md:justify-start">
          <h1 className="text-2xl font-bold italic text-red-600">BULL WHEELS</h1>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <HiX className="text-white text-2xl" /> : <HiMenu className="text-white text-2xl" />}
            </button>
          </div>
        </div>

        {/* 🔍 Search Box - Centered */}
<div className="w-full flex justify-center">
  <div className="w-full max-w-md">
    <div className="flex items-center border border-red-800 rounded-full overflow-hidden bg-black">
      <IoSearchOutline className="text-red-400 ml-4 mr-2 text-xl" />
      <input
        type="text"
        placeholder="Search for wheels..."
        className="w-full bg-black text-white placeholder-gray-400 focus:outline-none py-2"
      />
      <button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 font-semibold rounded-r-full">
        Search
      </button>
    </div>
  </div>
</div>

        {/* 🟢 Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
        <Link to="/" className="flex items-center gap-1 hover:underline">
            <FaHome /> Home
          </Link>
          <Link to="/cart" className="flex items-center gap-1 hover:underline">
            <FaShoppingCart /> Cart
          </Link>
          <Link to="/orders" className="flex items-center gap-1 hover:underline">
            <IoReorderFour /> Orders
          </Link>
          <Link to="/login" className="flex items-center gap-1 hover:underline">
            <FiLogIn /> Login/Signup
          </Link>
        </div>
      </div>

      {/* 🔵 Mobile Menu - Only links (not search box) */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col items-center gap-2 text-sm font-semibold">
          <Link to="/" className="flex items-center gap-1 hover:underline">
            <FaHome /> Home
          </Link>
          <Link to="/cart" className="flex items-center gap-1 hover:underline">
            <FaShoppingCart /> Cart
          </Link>
          <Link to="/orders" className="flex items-center gap-1 hover:underline">
            <IoReorderFour /> Orders
          </Link>
          <Link to="/login" className="flex items-center gap-1 hover:underline">
            <FiLogIn /> Login/Signup
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
