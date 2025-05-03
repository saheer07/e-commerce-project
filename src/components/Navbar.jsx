import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { IoReorderFour, IoSearchOutline } from "react-icons/io5";
import { ImUserTie } from "react-icons/im";
import { HiMenu, HiX } from "react-icons/hi";
import { GiCarWheel } from "react-icons/gi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserName(user?.name || null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName(null);
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="w-full bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full flex items-center justify-between md:justify-start">
          <h1 className="text-2xl font-bold italic text-red-600 flex items-center gap-1">
            BULL WHEELS <GiCarWheel />
          </h1>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <HiX className="text-white text-2xl" /> : <HiMenu className="text-white text-2xl" />}
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-md">
            <div className="flex items-center border border-red-800 rounded-full overflow-hidden bg-black">
              <IoSearchOutline className="text-red-400 ml-4 mr-2 text-xl" />
              <input
                type="text"
                placeholder="Search for wheels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black text-white placeholder-gray-400 py-2 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 font-semibold rounded-r-full"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link to="/" className="flex items-center gap-1 hover:underline"><FaHome /> Home</Link>
          {userName && (
            <>
              <Link to="/cart" className="flex items-center gap-1 hover:underline"><FaShoppingCart /> Cart</Link>
              <Link to="/orderlist" className="flex items-center gap-1 hover:underline"><IoReorderFour /> Orders</Link>
            </>
          )}
          {userName ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 hover:underline"><ImUserTie /> {userName}</span>
              <button onClick={handleLogout} className="text-sm border border-red-600 px-2 py-1 rounded">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1 hover:underline"><FiLogIn /> Login/Signup</Link>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col items-center gap-2 text-sm font-semibold">
          <Link to="/" className="flex items-center gap-1 hover:underline"><FaHome /> Home</Link>
          {userName && (
            <>
              <Link to="/cart" className="flex items-center gap-1 hover:underline"><FaShoppingCart /> Cart</Link>
              <Link to="/orderlist" className="flex items-center gap-1 hover:underline"><IoReorderFour /> Orders</Link>
            </>
          )}
          {userName ? (
            <>
              <span className="flex items-center gap-1 hover:underline"><ImUserTie /> {userName}</span>
              <button onClick={handleLogout} className="text-sm border border-red-600 text-red-500 px-3 py-1 rounded hover:bg-red-600 hover:text-white">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-1 hover:underline"><FiLogIn /> Login/Signup</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
