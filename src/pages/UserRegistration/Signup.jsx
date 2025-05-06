import React from 'react';
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { signupValidation } from './signupValidation';

const initialValues = {
  name: '',
  email: '',
  password: '',
  cpassword: ''
};

export default function Signup() {
  const navigate = useNavigate();

  const { values, handleBlur, handleChange, handleSubmit, errors, touched, isSubmitting } =
    useFormik({
      initialValues,
      validationSchema: signupValidation,
      onSubmit: async (values, { setSubmitting }) => {
        try {
          const response = await axios.get(`http://localhost:3001/users?email=${values.email}`);
          const existingUser = response.data;

          if (existingUser.length > 0) {
            alert('User already exists with this email.');
            setSubmitting(false);
            return;
          }

          const newUser = {
            name: values.name,
            email: values.email,
            password: values.password
          };

          await axios.post('http://localhost:3001/users', newUser);

          localStorage.setItem('user', JSON.stringify({
            name: values.name,
            email: values.email
          }));

          navigate('/');
        } catch (error) {
          console.error('Signup error:', error);
          alert('Signup failed. Try again.');
        } finally {
          setSubmitting(false);
        }
      }
    });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 px-4">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-zinc-700">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-2">Signup</h1>
        <p className="text-center text-gray-400 mb-6">Welcome! Please enter your details</p>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-sm font-medium text-red-400 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter your name"
              required
            />
            {errors.name && touched.name && <small className="text-red-500">{errors.name}</small>}
          </div>

          <div>
            <label className="block text-sm font-medium text-red-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
           className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter your email"
              required
            />
            {errors.email && touched.email && <small className="text-red-500">{errors.email}</small>}
          </div>

          <div>
            <label className="block text-sm font-medium text-red-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Password"
              required
            />
            {errors.password && touched.password && <small className="text-red-500">{errors.password}</small>}
          </div>

          <div>
            <label className="block text-sm font-medium text-red-400 mb-1">Confirm Password</label>
            <input
              type="password"
              name="cpassword"
              value={values.cpassword}
              onChange={handleChange}
              onBlur={handleBlur}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Confirm Password"
              required
            />
            {errors.cpassword && touched.cpassword && <small className="text-red-500">{errors.cpassword}</small>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-red-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
