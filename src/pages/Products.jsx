import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Read search term from URL query params
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search') || '';
    setSearchTerm(searchQuery);
  }, [location]);

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
      if (product.stock > 0) {
        cart.push(product);
        allCarts[userId] = cart;
        localStorage.setItem('allCarts', JSON.stringify(allCarts));
        toast.success('Added to cart!', { autoClose: 3000 });
      } else {
        toast.error('Out of stock!', { autoClose: 3000 });
      }
    }
  };

  const handleBuyNow = (product) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      toast.warning('Please login to proceed with purchase.', { autoClose: 3000 });
      return;
    }

    if (product.stock > 0) {
      const updatedProducts = products.map((prod) =>
        prod.id === product.id ? { ...prod, stock: prod.stock - 1 } : prod
      );
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      localStorage.setItem('buyNow', JSON.stringify(product));
      navigate('/payment');
    } else {
      toast.error('Out of stock! Cannot proceed with purchase.', { autoClose: 3000 });
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    return (
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (loading) {
    return <p className="text-center text-gray-300 mt-10">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="	bg-black  text-white min-h-screen px-4 py-6 bg-gradient-to-b from-black to-gray-900 px-4">
      <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Alloy Wheels</h2>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="bg-black text-red-500 font-bold px-4 py-2 rounded border border-gray-600 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
        >
          <option value="All">All Categories</option>
          <option value="Hatchback">For Hatchbacks</option>
          <option value="Sedan">For Sedans</option>
          <option value="SUV">For SUVs</option>
          <option value="Truck">For Trucks</option>
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-400">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-black border border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-red-600 transition duration-300"
            >
              <img
                src={product.image || 'https://via.placeholder.com/150'}
                alt={product.name || 'Product'}
                className="h-44 w-full object-contain rounded bg-white p-2 mb-4"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <h3
                className="text-lg font-semibold text-red-400 mb-2 cursor-pointer hover:underline"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.name}
              </h3>
              <p className="text-gray-300 mb-1">Price: ${product.price?.toFixed(2) || 'N/A'}</p>
              {/* <p className="text-gray-400 mb-1">Brand: {product.brand || 'Unknown'}</p> */}
              {/* <p className="text-gray-400 mb-1">Color: {product.color || 'N/A'}</p> */}
              {/* <p className="text-gray-400 mb-3">Stock: {product.stock ?? 'N/A'}</p> */}

              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <button
                  onClick={() => handleBuyNow(product)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium w-full"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-white text-black hover:bg-red-500 hover:text-white px-3 py-2 rounded text-sm font-medium w-full"
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
