import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Footer from '../components/Footer';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
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
  }, [location.search]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    if (searchQuery) {
      const nameMatch = product.name?.toLowerCase().includes(searchQuery);
      const categoryMatch = product.category?.toLowerCase().includes(searchQuery);
      return (nameMatch || categoryMatch) && matchesCategory;
    }
    return matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.price) || 0;
    const priceB = parseFloat(b.price) || 0;
    return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });

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

  if (loading) {
    return <p className="text-center text-gray-300 mt-10">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen text-white px-6 py-12">
      <h2 className="text-4xl font-bold text-center text-red-500 mb-8">Alloy Wheels</h2>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="bg-black text-red-500 font-medium px-5 py-3 rounded-md border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition ease-in-out"
        >
          <option value="All">All Categories</option>
          <option value="Hatchback">For Hatchbacks</option>
          <option value="Sedan">For Sedans</option>
          <option value="SUV">For SUVs</option>
          <option value="Truck">For Trucks</option>
        </select>
      </div>

      {/* Sort by Price */}
      <div className="flex justify-center mb-10">
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="bg-black text-red-500 font-medium px-5 py-3 rounded-md border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition ease-in-out"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <p className="text-center text-gray-400">
          No products found{searchQuery && ` for "${searchQuery}"`} .
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div
              onClick={() => navigate(`/product/${product.id}`)}
              key={product.id}
              className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 rounded-2xl p-4 shadow-md transition duration-500 ease-in-out hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(255,0,0,0.4)] hover:border-red-600 cursor-pointer group"
            >
              <div className="bg-white rounded-xl overflow-hidden h-44 flex items-center justify-center mb-4">
                <img
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name || 'Product'}
                  className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>

              {/* Name and Cart */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-red-500 group-hover:underline">{product.name}</h3>
                <button
                   onClick={() => handleAddToCart(product)}
                  className="text-red-500 hover:text-red-400 transition"
                >
                  <AiOutlineShoppingCart size={22} />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={i < (product.rating || 0) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-yellow-400"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.217 3.743a1 1 0 00.95.69h3.93c.969 0 1.371 1.24.588 1.81l-3.18 2.31a1 1 0 00-.364 1.118l1.218 3.743c.3.921-.755 1.688-1.54 1.118l-3.18-2.31a1 1 0 00-1.175 0l-3.18 2.31c-.784.57-1.838-.197-1.54-1.118l1.218-3.743a1 1 0 00-.364-1.118l-3.18-2.31c-.783-.57-.38-1.81.588-1.81h3.93a1 1 0 00.95-.69l1.217-3.743z" />
                  </svg>
                ))}
              </div>

              {/* Price */}
              <p className="text-gray-300 font-medium mb-1">
                Price:{' '}
                <span className="text-red-600 font-bold">
                  ${parseFloat(product.price)?.toFixed(2) || 'N/A'}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Products;
