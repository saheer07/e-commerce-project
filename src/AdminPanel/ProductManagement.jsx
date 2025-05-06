import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
  });

  // Fetch products
  useEffect(() => {
    axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
  }, []);

  const handleAddProduct = () => {
    axios
      .post("/api/products", newProduct)
      .then((response) => {
        setProducts([...products, response.data]);
        setNewProduct({ name: "", price: "", description: "" });
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteProduct = (id) => {
    axios
      .delete(`/api/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Product Management</h1>

      <div>
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          placeholder="Product Name"
        />
        <input
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          placeholder="Product Price"
        />
        <textarea
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          placeholder="Product Description"
        ></textarea>
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <div>
        <h2>Existing Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;
