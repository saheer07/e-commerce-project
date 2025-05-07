import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import homeImage from '../assets/images/Home.png';
import Footer from '../components/Footer';

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 }},
      { breakpoint: 768, settings: { slidesToShow: 2 }},
      { breakpoint: 480, settings: { slidesToShow: 1 }},
    ],
  };

  // Handle navigation to product details page
  const handleProductClick = (product) => {
    navigate(`/product-details/${product.id}`, { state: { product } });
  };

  return (
    <div className="w-full  bg-gradient-to-b from-black to-gray-900 px-4 text-white">
      {/* Hero Image */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={homeImage}
          alt="Home Banner"
          className="w-full h-full absolute top-0 left-0"
        />
        <button
          onClick={() => navigate('/products')}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded"
        >
          Shop Now
        </button>
      </div>

      
      {/* Slider */}
<div className="py-10 px-5">
  <h2 className="text-3xl font-semibold text-center text-red-500 mb-6">Hot Selling Wheels</h2>
  <Slider {...sliderSettings}>
    {products.slice(0, 4).map((product) => (
      <div key={product.id} className="px-3" onClick={() => navigate(`/product/${product.id}`)}>
        <div className="bg-white text-black rounded-lg shadow-md hover:shadow-red-400 transition duration-300 p-4 text-center cursor-pointer">
          <img
            src={product.image}
            alt={product.name}
            className="h-40 mx-auto mb-3 object-contain"
          />
          <p className="text-red-600 font-bold text-sm">{product.code || product.id}</p>
          <p className="text-gray-700 text-sm">{product.description || product.category}</p>
          <p className="text-black text-lg font-semibold">{product.size || product.price}"</p>
        </div>
      </div>
    ))}
  </Slider>
</div>

      <Footer />
    </div>
  );
}

export default Home;
