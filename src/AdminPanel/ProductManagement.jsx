import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

function ProductManagement() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    stock: '',
    category: 'Hatchback',
    description: '',
    image: '',
  });

  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3001/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      description: formData.description,
      image: formData.image,
    };

    try {
      if (editing) {
        await axios.put(`http://localhost:3001/products/${formData.id}`, {
          ...newProduct,
          id: formData.id, // Retain id while editing
        });
        toast.success('Product updated successfully');
      } else {
        await axios.post('http://localhost:3001/products', newProduct); // Don’t include id when adding
        toast.success('Product added successfully');
      }

      setFormData({
        id: '',
        name: '',
        price: '',
        stock: '',
        category: 'Hatchback',
        description: '',
        image: '',
      });

      fetchProducts();
      setEditing(false);
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      const productToDelete = products.find((product) => product.id === id);
      if (productToDelete) {
        await axios.post('http://localhost:3001/deletedProducts', productToDelete);
        await axios.delete(`http://localhost:3001/products/${id}`);
        toast.success('Product moved to trash');
        fetchProducts();
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (product) => {
    setFormData({ ...product });
    setEditing(true);
  };

  return (
    <div className="admin-products bg-gradient-to-b from-black to-gray-900 text-white min-h-screen p-6 flex flex-col md:flex-row">
      <AdminNavbar />

      <div className="w-full md:w-3/4 md:pl-8">
        <h2 className="text-3xl font-bold text-red-500 mb-6 text-center">
          {editing ? 'Edit Product' : 'Product Management'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-3xl mx-auto w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 border border-gray-700"
            >
              <option value="Hatchback">Hatchback</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="mt-4 w-full p-2 rounded bg-gray-800 border border-gray-700"
          ></textarea>

          <div className="mt-4">
            <label className="block mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="p-2 rounded bg-gray-800 border border-gray-700 w-full"
            />
          </div>

          {formData.image && (
            <div className="mt-4 flex justify-center">
              <img
                src={formData.image}
                alt="Preview"
                className="h-24 w-24 object-cover border border-gray-600 rounded"
              />
            </div>
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white font-semibold"
          >
            {editing ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        <div className="mt-12 max-w-6xl mx-auto w-full">
          <h3 className="text-2xl font-bold text-red-400 mb-4 text-center">Existing Products</h3>
          {products.length === 0 ? (
            <p className="text-center">No products found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product, index) => (
                <div
                  key={product.id || `${product.name}-${index}`}
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
                      onClick={() => handleSoftDelete(product.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Move to Trash
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;
