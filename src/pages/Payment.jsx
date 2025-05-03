import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaMoneyBillWave, FaGooglePay, FaCreditCard } from "react-icons/fa";

const Payment = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });

  useEffect(() => {
    const storedProduct = JSON.parse(localStorage.getItem("buyNow"));
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedProduct) {
      toast.error("No product selected. Redirecting...");
      navigate("/");
    } else {
      setProduct(storedProduct);
    }

    if (storedUser) {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleConfirmPayment = () => {
    if (!user) {
      toast.warn("Please log in to place an order.");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    if (paymentMethod === "Card") {
      const { number, expiry, cvv } = cardDetails;
      if (!number || !expiry || !cvv) {
        toast.error("Please enter complete card details.");
        return;
      }
    }

    try {
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || {};
      const userOrders = existingOrders[user.email] || [];

      const newOrder = {
        ...product,
        address,
        paymentMethod,
        cardDetails: paymentMethod === "Card" ? cardDetails : null,
        purchasedAt: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      };

      userOrders.push(newOrder);
      existingOrders[user.email] = userOrders;
      localStorage.setItem("orders", JSON.stringify(existingOrders));
      localStorage.removeItem("buyNow");

      toast.success("🎉 Order placed successfully!");
      navigate("/orderlist");
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (!product) return null;

  return (
    <div className="bg-black text-white min-h-screen px-4 py-10 flex flex-col items-center">
      <h2 className="text-3xl text-red-500 mb-6 font-bold">🔐 Secure Checkout</h2>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Left - Address & Payment */}
        <div className="bg-gray-900 border border-gray-700 p-6 rounded shadow-lg">
          <h3 className="text-xl mb-4 border-b border-gray-600 pb-2">🧾 Shipping & Payment</h3>

          <label className="block text-gray-400 mb-1">Delivery Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-600"
            placeholder="Enter your delivery address..."
            rows={3}
          />

          <label className="block text-gray-400 mb-1">Select Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-4"
          >
            <option value="COD">💵 Cash on Delivery</option>
            <option value="UPI">💸 UPI / PhonePe / GPay</option>
            <option value="Card">💳 Credit / Debit Card</option>
          </select>

          {paymentMethod === "Card" && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Card Number"
                maxLength="16"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Expiry (MM/YY)"
                  maxLength="5"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  maxLength="3"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleConfirmPayment}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full mt-6"
          >
            ✅ Confirm & Pay ₹{product.price}
          </button>
        </div>

        {/* Right - Summary */}
        <div className="bg-gray-900 border border-gray-700 p-6 rounded shadow-lg">
          <h3 className="text-xl mb-4 border-b border-gray-600 pb-2">🛍️ Order Summary</h3>
          <img
            src={product.image || "https://via.placeholder.com/200"}
            alt={product.name}
            className="h-48 w-full object-contain rounded bg-white p-2 mb-4"
          />
          <p className="text-xl text-red-400 font-bold mb-2">{product.name}</p>
          <p className="text-gray-300">Brand: {product.brand}</p>
          <p className="text-gray-300">Color: {product.color}</p>
          <p className="text-gray-300 mb-2">Price: ₹{product.price}</p>
          <p className="text-green-400 font-semibold">
            Delivery by: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
