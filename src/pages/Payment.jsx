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
          .then(async () => {
            const existingOrders = JSON.parse(localStorage.getItem("orders")) || {};
            const userOrders = existingOrders[user.email] || [];
            userOrders.push(newOrder);
            existingOrders[user.email] = userOrders;
            localStorage.setItem("orders", JSON.stringify(existingOrders));

            // ✅ Update stock in backend
            try {
              const response = await axios.get(`http://localhost:3001/products/${product.id}`);
              const dbProduct = response.data;
              const updatedStock = dbProduct.stock - quantity;

              await axios.put(`http://localhost:3001/products/${product.id}`, {
                ...dbProduct,
                stock: updatedStock >= 0 ? updatedStock : 0,
              });
            } catch (err) {
              console.error("Stock update failed:", err);
              toast.error("Failed to update product stock.");
            }

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
    <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen px-4 py-10 flex flex-col items-center">
      <h2 className="text-4xl text-red-500 mb-10 font-bold tracking-wide">🔐 Secure Checkout</h2>

      <div className="grid lg:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Left - Address & Payment */}
        <div className="bg-[#1a1a1a] border border-gray-700 p-8 rounded-2xl shadow-2xl">
          <h3 className="text-2xl mb-6 border-b border-gray-600 pb-3 font-semibold text-gray-200">🧾 Shipping & Payment</h3>

          {/* Address */}
          <label className="block text-sm text-gray-400 mb-1">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isDisabled}
            className="w-full p-3 mb-5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter your full delivery address..."
            rows={3}
          />

          {/* Quantity */}
          <label className="block text-sm text-gray-400 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            disabled={isDisabled}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full p-3 mb-5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          {/* Payment Method */}
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

          {/* UPI ID */}
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

          {/* Card Fields */}
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

          {/* Button */}
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

        {/* Right - Summary */}
        <div className="bg-[#1a1a1a] border border-gray-700 p-8 rounded-2xl shadow-2xl">
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
      </div>
    </div>
  );
};

export default Payment;
