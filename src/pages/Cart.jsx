import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const allCarts = JSON.parse(localStorage.getItem('allCarts')) || {};
      const userCart = allCarts[user.email] || [];
      setCartItems(userCart);
    } else {
      setCartItems([]);
    }
  }, []);

  const updateLocalStorageCart = (updatedCart) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const allCarts = JSON.parse(localStorage.getItem('allCarts')) || {};
      allCarts[user.email] = updatedCart;
      localStorage.setItem('allCarts', JSON.stringify(allCarts));
    }
  };

  const handleRemoveFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    updateLocalStorageCart(updatedCart);
  };

  const handleQuantityChange = (id, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = (item.quantity || 1) + delta;
        return {
          ...item,
          quantity: newQuantity < 1 ? 1 : newQuantity,
        };
      }
      return item;
    });

    setCartItems(updatedCart);
    updateLocalStorageCart(updatedCart);
  };

  const handleBuyNow = async (product) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      toast.warning('Please login to proceed with purchase.', { autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/products/${product.id}`);
      const dbProduct = response.data;
      const quantityToBuy = product.quantity || 1;

      if (dbProduct.stock >= quantityToBuy) {
        const updatedProduct = { ...dbProduct, stock: dbProduct.stock - quantityToBuy };
        await axios.put(`http://localhost:3001/products/${product.id}`, updatedProduct);

        // ✅ Keep item in cart; just set buyNow item
        localStorage.setItem(
          'buyNow',
          JSON.stringify({ ...product, quantity: quantityToBuy })
        );

        toast.success('Proceeding to payment...', { autoClose: 2000 });
        navigate('/payment');
      } else {
        toast.error('Not enough stock to fulfill your quantity.', { autoClose: 3000 });
      }
    } catch (error) {
      toast.error('Something went wrong while updating stock.', { autoClose: 3000 });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-6">
        <h2 className="text-4xl font-semibold text-red-500">Your Cart is Empty</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen p-6">
      <h2 className="text-4xl font-bold text-center text-red-500 mb-10">
        Your Shopping Cart
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={item.image || 'https://via.placeholder.com/150'}
              alt={item.name}
              className="h-48 w-full object-contain rounded-xl bg-white p-2 mb-4"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            <h3 className="text-2xl font-bold text-red-400 mb-2">{item.name}</h3>
            <p className="text-lg text-gray-300 mb-1">Price: ${item.price?.toFixed(2)}</p>
            <p className="text-sm text-gray-400 mb-1">Brand: {item.brand}</p>
            <p className="text-sm text-gray-400 mb-1">Color: {item.color}</p>
            <p className="text-sm text-gray-400 mb-1">Stock: {item.stock}</p>
            <p className="text-sm text-yellow-400 mb-3">
              Selected Quantity: {item.quantity || 1}
            </p>

            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => handleQuantityChange(item.id, -1)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-l text-white text-xl"
              >
                -
              </button>
              <span className="px-5 py-1 bg-gray-700 text-white text-lg">
                {item.quantity || 1}
              </span>
              <button
                onClick={() => handleQuantityChange(item.id, 1)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-r text-white text-xl"
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleRemoveFromCart(item.id)}
              className="w-full mb-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-md transition duration-200"
            >
              Remove
            </button>

            <button
              onClick={() => handleBuyNow(item)}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-md transition duration-200"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
