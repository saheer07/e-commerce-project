import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

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

    if (paymentMethod === "UPI") {
      if (!cardDetails.upiId.trim().match(/^[\w.-]+@[\w]+$/)) {
        toast.error("Enter a valid UPI ID (e.g., name@upi).");
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const deliveryCharge = product.price * quantity < 500 ? 40 : 0;
        const totalAmount = product.price * quantity + deliveryCharge;

        const newOrder = {
          ...product,
          quantity,
          address,
          paymentMethod,
          cardDetails: (paymentMethod === "Card" || paymentMethod === "UPI") ? cardDetails : null,
          deliveryCharge,
          total: totalAmount,
          purchasedAt: new Date().toISOString(),
          deliveryDate: `${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
          email: user.email,
          status: "Ordered"
        };

        axios.post("http://localhost:3001/orders", newOrder)
          .then(() => {
            const existingOrders = JSON.parse(localStorage.getItem("orders")) || {};
            const userOrders = existingOrders[user.email] || [];
            userOrders.push(newOrder);
            existingOrders[user.email] = userOrders;
            localStorage.setItem("orders", JSON.stringify(existingOrders));

            localStorage.removeItem("buyNow");
            toast.success(`🎉 Order placed successfully! Total: $${totalAmount}`);
            navigate("/orderlist");
          })
          .catch((err) => {
            console.error("Order saving failed:", err);
            toast.error("Something went wrong. Please try again.");
          })
          .finally(() => {
            setIsProcessing(false);
          });

      } catch (err) {
        console.error("Order error:", err);
        toast.error("Something went wrong. Please try again.");
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (!product) return null;

  const isDisabled = isProcessing;
  const deliveryCharge = product.price * quantity < 500 ? 40 : 0;
  const totalAmount = product.price * quantity + deliveryCharge;

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
            disabled={isDisabled}
            className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-600"
            placeholder="Enter your delivery address..."
            rows={3}
          />

          <label className="block text-gray-400 mb-1">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            disabled={isDisabled}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-600"
          />

          <label className="block text-gray-400 mb-1">Select Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={isDisabled}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-4"
          >
            <option value="COD">💵 Cash on Delivery</option>
            <option value="UPI">📱 UPI / GPay / PhonePe</option>
            <option value="Card">💳 Credit / Debit Card</option>
          </select>

          {/* UPI */}
          {paymentMethod === "UPI" && (
            <input
              type="text"
              placeholder="Enter UPI ID (e.g. user@upi)"
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-600"
              value={cardDetails.upiId}
              disabled={isDisabled}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, upiId: e.target.value })
              }
            />
          )}

          {/* Card Details */}
          {paymentMethod === "Card" && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Card Number"
                maxLength="16"
                value={cardDetails.number}
                disabled={isDisabled}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, number: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Expiry (MM/YY)"
                  maxLength="5"
                  value={cardDetails.expiry}
                  disabled={isDisabled}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  maxLength="3"
                  value={cardDetails.cvv}
                  disabled={isDisabled}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                />
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirmPayment}
            disabled={isDisabled}
            className={`mt-6 w-full py-2 px-4 rounded font-bold ${
              isDisabled
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isProcessing ? (
              <div className="flex justify-center items-center gap-2">
                <ClipLoader color="#fff" size={20} />
                Processing...
              </div>
            ) : (
              `✅ Confirm & Pay $${totalAmount}`
            )}
          </button>

          <p className="text-xs text-gray-400 mt-3 text-center">
            🔒 100% secure & encrypted payment
          </p>
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
          <p className="text-gray-300">Unit Price: ${product.price}</p>
          <p className="text-gray-300">Quantity: {quantity}</p>
          <p className="text-gray-300">
            Delivery Charges: {deliveryCharge > 0 ? `$${deliveryCharge}` : "Free"}
          </p>
          <p className="text-green-400 font-semibold mt-2">
            Total Price: ${totalAmount}
          </p>
          <p className="text-green-400 font-semibold">
            Delivery by: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} -{" "}
            {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>

          {quantity >= 3 && (
            <p className="text-yellow-400 font-semibold mt-2">
              🎉 Special Offer: You get 10% OFF on bulk orders (Applied in future)!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
