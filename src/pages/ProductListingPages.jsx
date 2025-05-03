import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(res => {
        setProducts(res.data);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const result = products.filter(item =>
        item.name.toLowerCase().includes(searchQuery)
      );
      setFiltered(result);
    } else {
      setFiltered(products);
    }
  }, [searchQuery, products]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      {filtered.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="border p-4 rounded shadow">
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover mb-2" />
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-gray-700">{item.description}</p>
              <p className="text-red-600 font-bold">$ {item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductListingPage;
