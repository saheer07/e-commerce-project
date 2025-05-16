import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-900  min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl">
        <h1 className="text-5xl font-bold text-center text-white mb-6">Contact Us</h1>
        <p className="mb-8 text-center text-lg">We'd love to hear from you. Reach out to us or fill in the contact form below.</p>

        <div className=" bg-gradient-to-b from-black to-gray-900 flex flex-col md:flex-row justify-between mb-10 space-y-8 md:space-y-0">
          <ul className="space-y-4 md:w-1/2">
            <li className="text-lg">Email: <a href="mailto:saheerchungath07@gmail.com" className="text-yellow-400 hover:text-yellow-500">saheerchungath07@gmail.com</a></li>
            <li className="text-lg">Phone: +1 123-456-7890</li>
            <li className="text-lg">Address: 456 Alloy Ave, Suite 10, Los Angeles, CA 90001, USA</li>
          </ul>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Social Media</h2>
            <div className="flex space-x-6 text-lg">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-600">Instagram</a>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-red-600 mb-6">Contact Form</h2>
        {formSent && <p className="text-green-400 mb-6 text-center">Your message has been sent successfully! We’ll get back to you shortly.</p>}
        
        <form onSubmit={handleSubmit} className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-white">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md transition duration-300"
          >
            Send Message
          </button>
        </form>

        <h2 className="text-2xl font-semibold text-red-600 mt-8 mb-4">Find Us</h2>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.582254930142!2d-118.243683!3d34.052235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c7b05ac7b629%3A0x6f7df5b6f6b8a5b7!2s456%20Alloy%20Ave%2C%20Los%20Angeles%2C%20CA%2090001%2C%20USA!5e0!3m2!1sen!2sin!4v1679747054651!5m2!1sen!2sin"
            width="100%"
            height="450"
            allowFullScreen=""
            loading="lazy"
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
