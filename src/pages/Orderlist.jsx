import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Orderlist = () => {
  const [orders, setOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelIndex, setCancelIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      axios.get(`http://localhost:3001/orders?email=${user.email}`)
        .then(response => setOrders(response.data))
        .catch(err => {
          console.error("Error fetching orders: ", err);
          setOrders([]);
        });
    } else {
      setOrders([]);
    }
  }, []);

  const confirmCancelOrder = () => {
    if (!cancelReason.trim()) {
      alert("Please enter a reason.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && cancelIndex !== null) {
      const orderToCancel = orders[cancelIndex];
      const cancelledOrder = {
        ...orderToCancel,
        cancelledAt: new Date().toISOString(),
        cancelReason,
        status: "Cancelled"
      };

      // Step 1: Update cancelled order in the 'cancelledOrders' table
      axios.post("http://localhost:3001/cancelledOrders", cancelledOrder)
        .then(() => {
          // Step 2: Delete the order from the 'orders' table
          return axios.delete(`http://localhost:3001/orders/${orderToCancel.id}`);
        })
        .then(() => {
          // Step 3: Update the stock of the product in the database
          return axios.get(`http://localhost:3001/products/${orderToCancel.id}`);
        })
        .then((response) => {
          const product = response.data;
          const updatedStock = product.stock + orderToCancel.quantity;  // Add the quantity back to the stock
          return axios.put(`http://localhost:3001/products/${product.id}`, {
            ...product,
            stock: updatedStock
          });
        })
        .then(() => {
          // Step 4: Remove the order from the local state
          setOrders(prev => prev.filter((_, i) => i !== cancelIndex));
          setShowCancelModal(false);
          setCancelReason("");
          setCancelIndex(null);
          setToastMessage("Your order has been successfully cancelled!");
          setTimeout(() => setToastMessage(""), 3000);
        })
        .catch(err => {
          console.error("Error cancelling order: ", err);
        });
    }
  };

  if (orders === null) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-950 text-white min-h-screen p-6 text-center flex flex-col items-center justify-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No Orders"
          className="w-32 mb-4 opacity-60"
        />
        <h2 className="text-3xl font-bold text-red-400">You have no orders yet.</h2>
        <p className="text-gray-400 mt-2">Start shopping and place your first order!</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-6 bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen p-6 text-white">
      <h2 className="text-4xl font-bold text-red-500 text-center mb-10">📦 My Orders</h2>

      <div className=" bg-gray-950 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order, index) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="cursor-pointer bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-800 hover:scale-105 transition-transform duration-200"
          >
            <img
              src={order.image || "https://via.placeholder.com/150"}
              alt={order.name}
              className="h-48 w-full object-contain rounded bg-white p-2 mb-4"
              onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
            />
            <h3 className="text-xl font-semibold text-red-400 mb-1">{order.name}</h3>
            <p className="text-gray-300">Price: ${order.price}</p>
            <p className="text-gray-400">Quantity: {order.quantity || 1}</p>
            <p className="text-green-400 font-medium">Delivery: {order.deliveryDate}</p>
            {order.status === "Cancelled" && (
              <p className="text-red-500 font-bold mt-1">Status: Cancelled</p>
            )}
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-white text-xl font-bold hover:text-red-400"
            >
              Back
            </button>
            <img
              src={selectedOrder.image}
              alt={selectedOrder.name}
              className="h-48 w-full object-contain rounded bg-white p-2 mb-4"
            />
            <h2 className="text-2xl font-bold text-red-400 mb-2">{selectedOrder.name}</h2>
            <p>Brand: {selectedOrder.brand}</p>
            <p>Color: {selectedOrder.color}</p>
            <p>Price: ${selectedOrder.price}</p>
            <p>Quantity: {selectedOrder.quantity || 1}</p>
            <p>Address: {selectedOrder.address}</p>
            <p>Payment Method: {selectedOrder.paymentMethod}</p>
            <p>Ordered At: {new Date(selectedOrder.purchasedAt).toLocaleString()}</p>
            <p className="text-green-400 font-medium">Delivery by: {selectedOrder.deliveryDate}</p>

            {selectedOrder.status !== "Cancelled" && (
              <button
                onClick={() => {
                  const index = orders.findIndex(o => o.id === selectedOrder.id);
                  setCancelIndex(index);
                  setShowCancelModal(true);
                  setSelectedOrder(null);
                }}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg w-full"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-md relative">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Cancel Order</h2>
            <p className="mb-2 text-gray-300">Please tell us why you're cancelling this order:</p>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-4"
              rows={4}
              placeholder="Enter reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setCancelIndex(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Close
              </button>
              <button
                onClick={confirmCancelOrder}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      <button
        onClick={() => navigate('/products')}
        className="mt-10 block mx-auto bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded"
      >
        Shop Now
      </button>
    </div>
  );
};

export default Orderlist;
