import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeImage from '../assets/images/Home.jpeg';
import Products from './Products';

function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleShopNow = () => {
    navigate('/products');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        <img
          src={homeImage}
          alt="Home Logo"
          className="w-full  object-cover"
        />
        <button
          onClick={handleShopNow}
          className="absolute bottom-10 right-10 bg-red-700 hover:bg-red-800 text-white py-3 px-6 rounded-md text-lg shadow-lg transition"
        >
          Shop Now
        </button>
      </div>

      {/* Category Buttons */}
      <div className="mt-0 py-10 text-center bg-black">
        <h2 className="text-2xl font-bold text-white mb-4">Browse by Category</h2>
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          {['Hatchbacks', 'Sedans', 'SUVs', 'Trucks'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-md font-medium text-white transition ${
                selectedCategory === category
                  ? 'bg-red-600'
                  : 'bg-gray-700 hover:bg-red-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Section */}
      <Products selectedCategory={selectedCategory} />
    </div>
  );
}

export default Home;
