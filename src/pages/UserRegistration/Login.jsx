import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:3001/users?email=${email}&password=${password}`);
      if (res.data.length > 0) {
        const user = res.data[0];

        localStorage.setItem("user", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || (user.isAdmin ? "admin" : "user"),
          isAdmin: user.isAdmin || user.role === "admin" // <-- add this line
        }));
        

        toast.success("Login successful!");

        if (user.role === "admin" || user.isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setErrorMsg('Invalid email or password');
        toast.error("Invalid email or password");
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Something went wrong. Please try again.');
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 px-4">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-zinc-700">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-2">Login</h2>
        <p className="text-center text-gray-400 mb-6">Welcome back! Please login to your account</p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-red-400 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-red-400 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Error Message */}
          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-red-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
