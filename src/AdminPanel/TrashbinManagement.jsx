import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import { FaTrashCanArrowUp } from "react-icons/fa6";

function TrashbinManagement() {
  const [deletedProducts, setDeletedProducts] = useState([]);

  useEffect(() => {
    fetchDeleted();
  }, []);

  const fetchDeleted = async () => {
    try {
      const res = await axios.get('http://localhost:3001/deletedProducts');
      setDeletedProducts(res.data);
    } catch (error) {
      toast.error('Failed to load trashbin');
    }
  };

  const handleRestore = async (product) => {
    try {
      // Add product back to products collection
      await axios.post('http://localhost:3001/products', product);

      // Remove from deletedProducts using product ID
      await axios.delete(`http://localhost:3001/deletedProducts/${product.id}`);

      toast.success('Product restored');
      fetchDeleted(); // Re-fetch to update the UI
    } catch (error) {
      toast.error('Failed to restore product');
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      // Remove from UI
      setDeletedProducts(deletedProducts.filter((product) => product.id !== id));

      // Delete from backend
      await axios.delete(`http://localhost:3001/deletedProducts/${id}`);
      toast.success('Product permanently deleted');
    } catch (error) {
      toast.error('Failed to permanently delete');
    }
  };

  return (
    <div className="admin-products bg-gradient-to-b from-black to-gray-900 text-white min-h-screen p-6 flex flex-col md:flex-row">
      <AdminNavbar />
      <div className="w-full md:w-3/4 md:pl-8">
        <h2 className="text-3xl font-bold text-red-500 mb-6 text-center"> <FaTrashCanArrowUp /> Trashbin Management</h2>
        {deletedProducts.length === 0 ? (
          <p className="text-center">No products in trash.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {deletedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 border border-gray-600 p-4 rounded-xl shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-3 rounded bg-white"
                />
                <h4 className="text-xl font-bold text-red-500">{product.name}</h4>
                <p className="text-gray-300">Price: ${product.price}</p>
                <p className="text-gray-300">Stock: {product.stock}</p>
                <p className="text-gray-400 text-sm mb-2">Category: {product.category}</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleRestore(product)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Permanently Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrashbinManagement;
