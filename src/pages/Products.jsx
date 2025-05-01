import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log("Error fetching products:", err));
  }, []);

  if (!products.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-gray-800 p-4 rounded shadow">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover rounded"
          />
          <h2 className="text-xl font-bold mt-2">{product.name}</h2>
          <p className="text-red-400">₹{product.price}</p>
          <button className="mt-3 bg-red-600 px-4 py-2 rounded">Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
