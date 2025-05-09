import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [carts, setCarts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get("http://localhost:3001/users");
        const ordersRes = await axios.get("http://localhost:3001/orders");

        setUsers(usersRes.data);
        setOrders(ordersRes.data);

        const storedUser = JSON.parse(localStorage.getItem("user"));
        setCurrentUser(storedUser);

        const allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
        setCarts(allCarts);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const getOrdersForUser = (email) => {
    return orders.filter((order) => order.email === email);
  };

  const getCartForUser = (email) => {
    return carts[email] || [];
  };

  const handleBlockUnblock = async (userId, isBlocked) => {
    try {
      const user = users.find((user) => user.id === userId);
      await axios.put(`http://localhost:3001/users/${userId}`, {
        ...user,
        isBlocked: !isBlocked,
      });
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, isBlocked: !isBlocked } : u))
      );
    } catch (err) {
      console.error("Error updating block status", err);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h2 className="text-4xl font-bold text-red-400 text-center mb-8">👥 User Management</h2>

      {currentUser && users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => {
            const userOrders = getOrdersForUser(user.email);
            const userCart = getCartForUser(user.email);
            return (
              <div key={user.id} className="bg-gray-900 p-5 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold text-red-300 mb-2">{user.name}</h3>
                <p className="text-gray-400 mb-1">Email: {user.email}</p>
                <p className="text-green-400 mb-2">Total Orders: {userOrders.length}</p>
                <button
                  onClick={() =>
                    setSelectedUser({ ...user, orders: userOrders, cart: userCart })
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2"
                >
                  View User details
                </button>
                <button
                  onClick={() => handleBlockUnblock(user.id, user.isBlocked)}
                  className={`px-4 py-2 rounded ${
                    user.isBlocked ? "bg-red-600 hover:bg-red-700" : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400">No user data found.</p>
      )}

{/* Orders & Cart Modal */}
{selectedUser && (
  <div className="bg-black bg-opacity-80 fixed inset-0 z-50 flex justify-center items-center pt-5">
    <div className="bg-gray-800 p-6 rounded-lg max-w-[90%] md:max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
      <button
        onClick={() => setSelectedUser(null)}
        className="absolute top-2 right-3 text-black text-xl hover:text-red-400"
      >
        Back
      </button>
      <h3 className="text-2xl font-bold text-red-400 mb-4 text-center md:text-left">
        {selectedUser.name}'s Profile
      </h3>

      {/* User Info (Scrollable if necessary) */}
      <div className="mb-6 bg-gray-700 p-4 rounded-lg border border-gray-600 overflow-y-auto max-h-[200px]">
        <p><span className="font-semibold text-gray-300">Name:</span> {selectedUser.name}</p>
        <p><span className="font-semibold text-gray-300">Email:</span> {selectedUser.email}</p>
        <p><span className="font-semibold text-gray-300">Password:</span> {selectedUser.password}</p>
        <p><span className="font-semibold text-gray-300">Total Orders:</span> {selectedUser.orders.length}</p>
      </div>

      {/* Orders (Scrollable with max height) */}
      <h4 className="text-xl font-bold text-yellow-400 mb-3">Orders:</h4>
      <div className="max-h-[300px] overflow-y-auto mb-6">
        {selectedUser.orders.length > 0 ? (
          <div className="space-y-4">
            {selectedUser.orders.map((order, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4 text-white border border-gray-600">
                <h4 className="text-lg font-semibold text-red-300">{order.name}</h4>
                <p>Price: ${order.price}</p>
                <p>Quantity: {order.quantity || 1}</p>
                <p>Payment Method: {order.paymentMethod}</p>
                <p>Address: {order.address}</p>
                <p className="text-green-400">Delivery by: {order.deliveryDate}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No orders placed by this user.</p>
        )}
      </div>

      {/* Cart Items (Scrollable with max height) */}
      <h4 className="text-xl font-bold text-blue-400 mt-6 mb-3">Cart Items:</h4>
      <div className="max-h-[300px] overflow-y-auto">
        {selectedUser.cart && selectedUser.cart.length > 0 ? (
          <div className="space-y-4">
            {selectedUser.cart.map((item, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4 text-white border border-gray-600">
                <div className="flex items-center">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 mr-4 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300">{item.name}</h4>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity || 1}</p>
                    <p>Color: {item.color}</p>
                    <p>Brand: {item.brand}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No items in cart.</p>
        )}
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default UserManagement;
