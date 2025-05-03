import React from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { signupValidation } from './signupValidation';

const initialValues = {
  name: '',
  email: '',
  password: '',
  cpassword: ''
};

export default function Signup() {
  const navigate = useNavigate();

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues,
    validationSchema: signupValidation,
    onSubmit: (values) => {
      const savedUsers = JSON.parse(localStorage.getItem("signupUsers")) || [];

      const existingUser = savedUsers.find(user => user.email === values.email);
      if (existingUser) {
        alert("User already exists with this email.");
        return;
      }

      savedUsers.push({ name: values.name, email: values.email, password: values.password });
      localStorage.setItem("signupUsers", JSON.stringify(savedUsers));

      localStorage.setItem("user", JSON.stringify({ name: values.name, email: values.email }));

      navigate("/"); // Redirect to home
    }
  });

  return (
    <div className="flex w-full h-screen items-center justify-center bg-black">
      <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md border border-red-800">
        <h1 className="text-2xl font-bold text-center text-red-600 mb-2">Signup</h1>
        <p className="text-center text-gray-400 mb-6">Welcome! Please enter your details</p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Fields (Name, Email, Password, Confirm Password) */}
          <div>
            <label className="text-red-600">Name</label>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-black text-red-600"
              placeholder="Enter your name"
            />
            {errors.name && touched.name && <small className="text-red-500">{errors.name}</small>}
          </div>

          <div>
            <label className="text-red-600">Email</label>
            <input
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-black text-red-600"
              placeholder="Enter your email"
            />
            {errors.email && touched.email && <small className="text-red-500">{errors.email}</small>}
          </div>

          <div>
            <label className="text-red-600">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-black text-red-600"
              placeholder="Password"
            />
            {errors.password && touched.password && <small className="text-red-500">{errors.password}</small>}
          </div>

          <div>
            <label className="text-red-600">Confirm Password</label>
            <input
              type="password"
              name="cpassword"
              value={values.cpassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-black text-red-600"
              placeholder="Confirm Password"
            />
            {errors.cpassword && touched.cpassword && <small className="text-red-500">{errors.cpassword}</small>}
          </div>

          <button type="submit" className="w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-800">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
