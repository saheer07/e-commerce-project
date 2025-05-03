import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const allCarts = JSON.parse(localStorage.getItem('allCarts')) || {};
      const userCart = allCarts[user.email] || [];
      setCartItems(userCart);
    } else {
      setCartItems([]); // Not logged in
    }
  }, []);

  const handleRemoveFromCart = (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const allCarts = JSON.parse(localStorage.getItem('allCarts')) || {};
      const userCart = allCarts[user.email] || [];

      const updatedCart = userCart.filter((item) => item.id !== id);
      allCarts[user.email] = updatedCart;

      localStorage.setItem('allCarts', JSON.stringify(allCarts));
      setCartItems(updatedCart);
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
              className="h-48 object-cover rounded mb-4"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            <h3 className="text-xl font-semibold text-red-400 mb-2">{item.name}</h3>
            <p className="text-gray-300 mb-1">Price: ₹{item.price?.toFixed(2)}</p>
            <p className="text-gray-400 mb-1">Brand: {item.brand}</p>
            <p className="text-gray-400 mb-1">Color: {item.color}</p>
            <p className="text-gray-400 mb-3">Stock: {item.stock}</p>

            <button
              onClick={() => handleRemoveFromCart(item.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Remove from Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
