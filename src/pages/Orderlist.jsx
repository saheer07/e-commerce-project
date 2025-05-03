import React, { useEffect, useState } from "react";

const Orderlist = () => {
  const [orders, setOrders] = useState(null); // initially null to detect loading

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
      const userOrders = allOrders[user.email] || [];
      setOrders(userOrders); // even if it's an empty array, set it
    } else {
      setOrders([]); // if user not found, also show "No orders"
    }
  }, []);

  const handleCancelOrder = (orderIndex) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
      const userOrders = allOrders[user.email] || [];

      // Remove order
      userOrders.splice(orderIndex, 1);

      // Update localStorage
      allOrders[user.email] = userOrders;
      localStorage.setItem("orders", JSON.stringify(allOrders));

      // Update state
      setOrders([...userOrders]);
    }
  };

  // Show loading state
  if (orders === null) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  // Show "No orders" message with proper style
  if (orders.length === 0) {
    return (
      <div className="bg-black text-white min-h-screen p-6 text-center">
        <h2 className="text-3xl font-bold text-red-500">No Orders Found</h2>
      </div>
    );
  }

  // Render orders
  return (
    <div className="bg-black min-h-screen p-6 text-white">
      <h2 className="text-3xl text-red-500 text-center mb-6">📦 My Orders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order, index) => (
          <div key={index} className="bg-gray-900 p-4 rounded shadow-lg border border-gray-700">
            <img
              src={order.image || "https://via.placeholder.com/150"}
              alt={order.name}
              className="h-40 object-cover rounded mb-3"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
            <h3 className="text-xl text-red-400 font-semibold mb-1">{order.name}</h3>
            <p>Brand: {order.brand}</p>
            <p>Color: {order.color}</p>
            <p>Price: ₹{order.price}</p>
            <p>Address: {order.address}</p>
            <p>Payment: {order.paymentMethod}</p>
            <p>Ordered on: {order.purchasedAt}</p>
            <p className="text-green-400">Delivery by: {order.deliveryDate}</p>

            <button
              onClick={() => handleCancelOrder(index)}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cancel Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orderlist;
