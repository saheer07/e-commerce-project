import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (error) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      toast.warning('Please login to add items to cart.', { autoClose: 3000 });
      return;
    }

    const userId = loggedInUser.email;
    let allCarts = JSON.parse(localStorage.getItem('allCarts')) || {};
    let cart = allCarts[userId] || [];

    const alreadyInCart = cart.find((item) => item.id === product.id);
    if (alreadyInCart) {
      toast.info('Item already in cart!', { autoClose: 3000 });
    } else {
      cart.push(product);
      allCarts[userId] = cart;
      localStorage.setItem('allCarts', JSON.stringify(allCarts));
      toast.success('Added to cart!', { autoClose: 3000 });
    }
  };

  const handleBuyNow = (product) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      toast.warning('Please login to proceed with purchase.', { autoClose: 3000 });
      return;
    }

    localStorage.setItem('buyNow', JSON.stringify(product));
    navigate('/payment');
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  if (loading) return <p className="text-center text-gray-300">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h2 className="text-3xl font-bold text-center text-red-500 mb-4">Alloy Wheels</h2>

      <div className="flex justify-center mb-6">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
        >
          <option value="All">All Categories</option>
          <option value="Hatchback">For Hatchbacks</option>
          <option value="Sedan">For Sedans</option>
          <option value="SUV">For SUVs</option>
          <option value="Truck">For Trucks</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-400">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg hover:shadow-red-600 transition"
            >
              <img
                src={product.image || 'https://via.placeholder.com/150'}
                alt={product.name || 'Product'}
                className="h-48 object-cover rounded mb-4"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <h3
                className="text-xl font-semibold text-red-400 mb-2 cursor-pointer hover:underline"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.name}
              </h3>
              <p className="text-gray-300 mb-1">Price: ${product.price?.toFixed(2) || 'N/A'}</p>
              <p className="text-gray-400 mb-1">Brand: {product.brand || 'Unknown'}</p>
              <p className="text-gray-400 mb-1">Color: {product.color || 'N/A'}</p>
              <p className="text-gray-400 mb-3">Stock: {product.stock ?? 'N/A'}</p>

              <div className="flex justify-between gap-2">
                <button
                  onClick={() => handleBuyNow(product)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-medium"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-white text-black hover:bg-red-500 hover:text-white px-3 py-1 rounded font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
