import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center text-gray-300">Loading product details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <p className="text-center text-gray-400">Product not found.</p>;

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h2 className="text-3xl font-bold text-red-500 mb-4">{product.name}</h2>
        <p className="text-gray-300 mb-2">Price: ${product.price?.toFixed(2)}</p>
        <p className="text-gray-400 mb-2">Brand: {product.brand}</p>
        <p className="text-gray-400 mb-2">Color: {product.color}</p>
        <p className="text-gray-400 mb-2">Category: {product.category}</p>
        <p className="text-gray-400 mb-2">Stock: {product.stock}</p>
        <p className="text-gray-500 mt-4">Description: {product.description || 'No description available.'}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
