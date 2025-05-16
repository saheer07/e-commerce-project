import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import Footer from "../components/Footer";

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
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

    // ✅ Simulate delay for processing (6 seconds)
    setTimeout(async () => {
      try {
        const productResponse = await axios.get(`http://localhost:3001/products/${product.id}`);
        const currentProduct = productResponse.data;

        if (currentProduct.stock < quantity) {
          toast.error(`Only ${currentProduct.stock} items available in stock`);
          setIsProcessing(false);
          return;
        }

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
          deliveryDate: `${new Date(Date.now() + 3 * 86400000).toLocaleDateString()} - ${new Date(Date.now() + 5 * 86400000).toLocaleDateString()}`,
          email: user.email,
          status: "Ordered",
          userId: user.id
        };

        await axios.post("http://localhost:3001/orders", newOrder);

        const updatedStock = currentProduct.stock - quantity;
        await axios.put(`http://localhost:3001/products/${product.id}`, {
          ...currentProduct,
          stock: updatedStock >= 0 ? updatedStock : 0,
        });

        const existingOrders = JSON.parse(localStorage.getItem("orders")) || {};
        const userOrders = existingOrders[user.email] || [];
        userOrders.push(newOrder);
        existingOrders[user.email] = userOrders;
        localStorage.setItem("orders", JSON.stringify(existingOrders));

        localStorage.removeItem("buyNow");
        toast.success(`🎉 Order placed successfully! Total: $${totalAmount}`);
        setPaymentSuccess(true);
      } catch (err) {
        console.error("Order error:", err);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }, 6000); // ✅ 6 seconds delay
  };

  if (!product) return null;

  const deliveryCharge = product.price * quantity < 500 ? 40 : 0;
  const totalAmount = product.price * quantity + deliveryCharge;

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <svg
          className="w-24 h-24 text-green-500 mb-6 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-3xl font-bold text-green-400 mb-2">Payment Successful!</h2>
        <p className="text-gray-300 mb-6">Thank you for your order. We’re getting it ready.</p>
        <button
          onClick={() => navigate("/orderlist")}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl font-semibold transition-all"
        >
          OK
        </button>
      </div>
    );
  }

  const isDisabled = isProcessing;

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen px-4 py-10 flex flex-col items-center">
      <h2 className="text-4xl text-red-500 mb-10 font-bold tracking-wide">🔐 Secure Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl">

        {/* Order Summary */}
        <div className="bg-[#1a1a1a] border border-gray-700 p-8 rounded-2xl shadow-2xl order-1 lg:order-2">
          <h3 className="text-2xl mb-6 border-b border-gray-600 pb-3 font-semibold text-gray-200">🛍️ Order Summary</h3>
          <img
            src={product.image || "https://via.placeholder.com/200"}
            alt={product.name}
            className="h-52 w-full object-contain rounded-lg bg-white p-2 mb-6"
          />
          <div className="space-y-2">
            <p className="text-2xl text-red-400 font-bold">{product.name}</p>
            <p className="text-sm text-gray-300">Brand: {product.brand}</p>
            <p className="text-sm text-gray-300">Color: {product.color}</p>
            <p className="text-sm text-gray-300">Unit Price: ${product.price}</p>
            <p className="text-sm text-gray-300">Quantity: {quantity}</p>
            <p className="text-sm text-gray-300">
              Delivery Charge: {deliveryCharge > 0 ? `$${deliveryCharge}` : "Free"}
            </p>
            <p className="text-lg text-green-400 font-semibold mt-3">Total: ${totalAmount}</p>
            <p className="text-green-400 font-semibold">
              Delivery between{" "}
              {new Date(Date.now() + 3 * 86400000).toLocaleDateString()} -{" "}
              {new Date(Date.now() + 5 * 86400000).toLocaleDateString()}
            </p>

            {quantity >= 3 && (
              <p className="text-yellow-400 font-semibold mt-2">
                🎉 Bulk Order Bonus: You earned 10% OFF on future purchases!
              </p>
            )}
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="bg-[#1a1a1a] border border-gray-700 p-8 rounded-2xl shadow-2xl order-2 lg:order-1">
          <h3 className="text-2xl mb-6 border-b border-gray-600 pb-3 font-semibold text-gray-200">🧾 Shipping & Payment</h3>

          <label className="block text-sm text-gray-400 mb-1">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isDisabled}
            className="w-full p-3 mb-5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter your full delivery address..."
            rows={3}
          />

          <label className="block text-sm text-gray-400 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            disabled={isDisabled}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full p-3 mb-5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <label className="block text-sm text-gray-400 mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={isDisabled}
            className="w-full p-3 mb-5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="COD">💵 Cash on Delivery</option>
            <option value="UPI">📱 UPI / GPay / PhonePe</option>
            <option value="Card">💳 Credit / Debit Card</option>
          </select>

          {paymentMethod === "UPI" && (
            <input
              type="text"
              placeholder="e.g. username@upi"
              className="w-full p-3 mb-5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={cardDetails.upiId}
              disabled={isDisabled}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, upiId: e.target.value })
              }
            />
          )}

          {paymentMethod === "Card" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                maxLength="16"
                value={cardDetails.number}
                disabled={isDisabled}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, number: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={cardDetails.expiry}
                  disabled={isDisabled}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleConfirmPayment}
            disabled={isDisabled}
            className={`mt-8 w-full py-3 px-6 rounded-xl font-bold tracking-wide transition-all duration-200 ${
              isDisabled
                ? "bg-gray-700 cursor-not-allowed"
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

          <p className="text-xs text-gray-400 mt-4 text-center">
            🔒 Your payment is secured with industry-grade encryption.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
