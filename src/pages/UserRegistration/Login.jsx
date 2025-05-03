import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const savedUsers = JSON.parse(localStorage.getItem("signupUsers")) || [];

    const matchedUser = savedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      localStorage.setItem("user", JSON.stringify(matchedUser));
      navigate("/"); // Redirect to the homepage or dashboard after login
    } else {
      setErrorMsg("Invalid email or password");
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center bg-black">
      <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md border border-red-800">
        <h1 className="text-2xl font-bold text-center text-red-600 mb-2">Login</h1>
        <p className="text-center text-gray-400 mb-6">Welcome back! Please enter your details</p>
        {errorMsg && <div className="text-center text-red-500 mb-4">{errorMsg}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="text-red-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-black text-red-600"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="text-red-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-black text-red-600"
              placeholder="Password"
            />
          </div>

          <button type="submit" className="w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-800">
            Log In
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Don't have an account? <Link to="/signup" className="text-red-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
