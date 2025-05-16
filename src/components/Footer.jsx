import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 px-4 text-white py-6 mt-10 animate-fade-in">
      <div className="container mx-auto text-center">
        {/* Footer Links */}
        <div className="flex justify-center gap-6 mb-4">
          <a href="/about" className="hover:text-red-500 transition transform hover:scale-105">About Us</a>
          <a href="/contact" className="hover:text-red-500 transition transform hover:scale-105">Contact</a>
          <a href="/privacy-policy" className="hover:text-red-500 transition transform hover:scale-105">Privacy Policy</a>
          <a href="/terms" className="hover:text-red-500 transition transform hover:scale-105">Terms</a>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center gap-6 mb-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-500 hover:scale-110 transition">
            <i className="fab fa-facebook-f"></i> Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-300 hover:scale-110 transition">
            <i className="fab fa-twitter"></i> Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 hover:scale-110 transition">
            <i className="fab fa-instagram"></i> Instagram
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-700 hover:scale-110 transition">
            <i className="fab fa-linkedin-in"></i> LinkedIn
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm mb-2">© 2025 YourCompany. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
