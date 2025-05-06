import React, { useEffect, useState } from "react";

const Orderlist = () => {
  const [orders, setOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelIndex, setCancelIndex] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
      const userOrders = allOrders[user.email] || [];
      setOrders(userOrders);
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
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
      const userOrders = allOrders[user.email] || [];

      const cancelledOrder = {
        ...userOrders[cancelIndex],
        cancelledAt: new Date().toISOString(),
        cancelReason,
      };

      const cancelledOrders = JSON.parse(localStorage.getItem("cancelledOrders")) || {};
      const userCancelled = cancelledOrders[user.email] || [];
      userCancelled.push(cancelledOrder);
      cancelledOrders[user.email] = userCancelled;
      localStorage.setItem("cancelledOrders", JSON.stringify(cancelledOrders));

      userOrders.splice(cancelIndex, 1);
      allOrders[user.email] = userOrders;
      localStorage.setItem("orders", JSON.stringify(allOrders));
      setOrders([...userOrders]);
    }

    setShowCancelModal(false);
    setCancelReason("");
    setCancelIndex(null);
  };

  if (orders === null) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-black text-white min-h-screen p-6 text-center flex flex-col items-center justify-center">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Orders" className="w-32 mb-4 opacity-60" />
        <h2 className="text-3xl font-bold text-red-400">You have no orders yet.</h2>
        <p className="text-gray-400 mt-2">Start shopping and place your first order!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen p-6 text-white">
      <h2 className="text-4xl font-bold text-red-500 text-center mb-10">📦 My Orders</h2>

      {/* Order Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order, index) => (
          <div
            key={index}
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
            <p className="text-green-400 font-medium">Delivery: {order.deliveryDate}</p>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-white text-xl font-bold hover:text-red-400"
            >
              ✖
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
            <p>Address: {selectedOrder.address}</p>
            <p>Payment Method: {selectedOrder.paymentMethod}</p>
            <p>Ordered At: {new Date(selectedOrder.purchasedAt).toLocaleString()}</p>
            <p className="text-green-400 font-medium">Delivery by: {selectedOrder.deliveryDate}</p>

            <button
              onClick={() => {
                const index = orders.findIndex(o => o.purchasedAt === selectedOrder.purchasedAt);
                setCancelIndex(index);
                setShowCancelModal(true);
                setSelectedOrder(null);
              }}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg w-full"
            >
              Cancel Order
            </button>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
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
    </div>
  );
};

export default Orderlist;
