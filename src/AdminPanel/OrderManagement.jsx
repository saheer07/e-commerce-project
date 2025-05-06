import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  const handleChangeOrderStatus = (id, status) => {
    axios
      .put(`/api/orders/${id}`, { status })
      .then(() => {
        setOrders(
          orders.map((order) =>
            order.id === id ? { ...order, status: status } : order
          )
        );
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Order Management</h1>

      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Order #{order.id} - {order.status}
            <button onClick={() => handleChangeOrderStatus(order.id, "Shipped")}>Mark as Shipped</button>
            <button onClick={() => handleChangeOrderStatus(order.id, "Delivered")}>Mark as Delivered</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderManagement;
