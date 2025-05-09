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

  const handleBuyNow = async (product) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      toast.warning('Please login to proceed with purchase.', { autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/products/${product.id}`);
      const dbProduct = response.data;

      if (dbProduct.stock > 0) {
        const updatedProduct = { ...dbProduct, stock: dbProduct.stock - 1 };

        await axios.put(`http://localhost:3001/products/${product.id}`, updatedProduct);

        // remove from cart
        const updatedCart = cartItems.filter((item) => item.id !== product.id);
        setCartItems(updatedCart);
        updateLocalStorageCart(updatedCart);

        // set item for payment
        localStorage.setItem('buyNow', JSON.stringify(updatedProduct));

        toast.success('Proceeding to payment...', { autoClose: 2000 });
        navigate('/payment');
      } else {
        toast.error('Out of stock! Cannot proceed with purchase.', { autoClose: 3000 });
      }
    } catch (error) {
      toast.error('Something went wrong while updating stock.', { autoClose: 3000 });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-black text-white min-h-screen p-6 text-center">
        <h2 className="text-3xl font-bold text-red-500">Your Cart is Empty</h2>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h2 className="text-3xl font-bold text-red-500 mb-6 text-center">Your Cart</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg"
          >
            <img
              src={item.image || 'https://via.placeholder.com/150'}
              alt={item.name}
              className="h-48 w-full object-contain rounded bg-white p-2 mb-4"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            <h3 className="text-xl font-semibold text-red-400 mb-2">{item.name}</h3>
            <p className="text-gray-300 mb-1">Price: ${item.price?.toFixed(2)}</p>
            <p className="text-gray-400 mb-1">Brand: {item.brand}</p>
            <p className="text-gray-400 mb-1">Color: {item.color}</p>
            <p className="text-gray-400 mb-1">Stock: {item.stock}</p>
            <p className="text-gray-300 mb-3">Quantity: {item.quantity || 1}</p>

            <button
              onClick={() => handleRemoveFromCart(item.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mb-2 w-full"
            >
              Remove from Cart
            </button>

            <button
              onClick={() => handleBuyNow(item)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
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
