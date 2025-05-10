import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
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

  const handleBuyNow = async (product) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      toast.warning('Please login to proceed with purchase.', { autoClose: 3000 });
      return;
    }

    if (product.stock > 0) {
      const updatedProduct = { ...product, stock: product.stock - 1 };

      try {
        await axios.put(`http://localhost:3001/products/${product.id}`, updatedProduct);

        const updatedProducts = products.map((p) =>
          p.id === product.id ? updatedProduct : p
        );
        setProducts(updatedProducts);

        localStorage.setItem('buyNow', JSON.stringify(updatedProduct));
        toast.success('Proceeding to payment...', { autoClose: 2000 });
        navigate('/payment');
      } catch (error) {
        toast.error('Error updating product stock. Try again.', { autoClose: 3000 });
      }
    } else {
      toast.error('Out of stock! Cannot proceed with purchase.', { autoClose: 3000 });
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Filter by category
  const filteredProducts = products.filter((product) =>
    selectedCategory === 'All' || product.category === selectedCategory
  );

  // Sort by price safely using parseFloat
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.price) || 0;
    const priceB = parseFloat(b.price) || 0;
    return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });

  if (loading) {
    return <p className="text-center text-gray-300 mt-10">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="bg-black text-white min-h-screen px-4 py-6 bg-gradient-to-b from-black to-gray-900">
      <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Alloy Wheels</h2>

      {/* Category Filter */}
      <div className="flex justify-center mb-6">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="bg-black text-red-500 font-bold px-4 py-2 rounded border border-gray-600 w-full max-w-xs"
        >
          <option value="All">All Categories</option>
          <option value="Hatchback">For Hatchbacks</option>
          <option value="Sedan">For Sedans</option>
          <option value="SUV">For SUVs</option>
          <option value="Truck">For Trucks</option>
        </select>
      </div>

      {/* Sort by Price */}
      <div className="flex justify-center mb-8">
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="bg-black text-red-500 font-bold px-4 py-2 rounded border border-gray-600 w-full max-w-xs"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <p className="text-center text-gray-400">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
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
              <p className="text-gray-300 mb-1">
                Price: ${parseFloat(product.price)?.toFixed(2) || 'N/A'}
              </p>

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
