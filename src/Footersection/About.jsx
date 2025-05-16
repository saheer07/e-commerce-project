import React from 'react';

const About = () => {
  return (
    <div className="about-page bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-red-500 mb-6">About Us</h1>

      <div className="mb-6">
        <p className="text-lg">
          Welcome to our website! We are a company dedicated to providing high-quality products and excellent customer service. 
          Our mission is to bring you the best products at competitive prices, all backed by our commitment to customer satisfaction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">Our Vision</h3>
          <p>
            Our vision is to become the leading e-commerce platform offering the most innovative and high-quality products globally. 
            We aim to deliver products that make a difference in people's lives, through innovation, style, and functionality.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-semibold text-green-400 mb-4">Our Values</h3>
          <ul className="list-disc list-inside">
            <li>Customer Satisfaction</li>
            <li>Integrity</li>
            <li>Innovation</li>
            <li>Excellence</li>
            <li>Responsibility</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform mb-6">
        <h3 className="text-xl font-semibold text-blue-400 mb-4">Why Choose Us?</h3>
        <ul className="list-inside">
          <li>High-Quality Products</li>
          <li>Fast & Secure Delivery</li>
          <li>Excellent Customer Support</li>
          <li>Affordable Pricing</li>
         
        </ul>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
        <h3 className="text-xl font-semibold text-purple-400 mb-4">Our Team</h3>
        <p>
          We are a passionate group of individuals committed to making your shopping experience unforgettable. 
          Our team of experts work tirelessly to curate the best products and ensure a seamless customer experience. 
        </p>
      </div>
    </div>
  );
};

export default About;
