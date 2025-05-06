import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeImage from "../assets/images/Home.png"; // Make sure this path is correct
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
      <div className="w-full h-[60vh] sm:h-[75vh] lg:h-screen relative overflow-hidden">
        <img
          src={homeImage}
          alt="Home"
          className="w-full  h-full absolute top-0 left-0"
        />
        <button
          onClick={handleShopNow}
          className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 bg-red-700 hover:bg-red-800 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md text-base sm:text-lg shadow-lg transition"
        >
          Shop Now
        </button>
      </div>

      {/* Category Section
      <div className="mt-8 sm:mt-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-red-500 mb-4">Browse by Category</h2>
        <div className="flex justify-center flex-wrap gap-6">
          {['Hatchback', 'Sedan', 'SUV', 'Truck'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition"
            >
              {category}
            </button>
          ))}
        </div>
      </div> */}

      {/* Product Section */}
      <div className="mt-0 sm:mt- text-center">
        <Products selectedCategory={selectedCategory} />
      </div>
    </div>
  );
}

export default Home;
