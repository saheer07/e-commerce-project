import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StarRating from './StarRating';
import ReviewItem from './ReviewItem';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const reviewRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        if (response.data) {
          setProduct(response.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (product) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      toast.warning('Please login to add items to cart.', { autoClose: 3000 });
      return;
    }

    const userId = loggedInUser.email;
    let allCarts = JSON.parse(localStorage.getItem('allCarts')) || {};
    let cart = allCarts[userId] || [];

    const alreadyInCart = cart.find((item) => item.id === product.id);
    if (alreadyInCart) {
      toast.info('Item already in cart!', { autoClose: 3000 });
    } else {
      cart.push(product);
      allCarts[userId] = cart;
      localStorage.setItem('allCarts', JSON.stringify(allCarts));
      toast.success('Added to cart!', { autoClose: 3000 });
    }
  };

  const handleReviewSubmit = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      toast.warning('Please login to submit a review.', { autoClose: 3000 });
      return;
    }

    if (review.trim()) {
      setSubmitting(true);
      const newReview = {
        user: loggedInUser.name || 'Anonymous',
        rating,
        comment: review.trim(),
      };

      const updatedReviews = [...(product.reviews || []), newReview];

      try {
        await axios.patch(`http://localhost:3001/products/${id}`, {
          reviews: updatedReviews,
        });

        setProduct((prevProduct) => ({
          ...prevProduct,
          reviews: updatedReviews,
        }));

        setReview('');
        setRating(5);
        setHighlightedIndex(updatedReviews.length - 1);

        setTimeout(() => {
          reviewRefs.current[updatedReviews.length - 1]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }, 300);

        setTimeout(() => {
          setHighlightedIndex(null);
        }, 3000);

        toast.success('Review submitted!');
      } catch (error) {
        toast.error('Failed to submit review');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleReviewDelete = async (reviewIndex) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      toast.warning('Please login to delete a review.', { autoClose: 3000 });
      return;
    }

    const reviewToDelete = product.reviews[reviewIndex];
    if (reviewToDelete.user === loggedInUser.name || reviewToDelete.user === 'Anonymous') {
      const updatedReviews = product.reviews.filter((_, index) => index !== reviewIndex);

      try {
        await axios.patch(`http://localhost:3001/products/${id}`, {
          reviews: updatedReviews,
        });

        setProduct((prevProduct) => ({
          ...prevProduct,
          reviews: updatedReviews,
        }));

        toast.success('Review deleted!', { autoClose: 3000 });
      } catch (error) {
        toast.error('Failed to delete review', { autoClose: 3000 });
      }
    } else {
      toast.error('You can only delete your own reviews.', { autoClose: 3000 });
    }
  };

  const handleBuyNow = (product) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      toast.warning('Please login to proceed with purchase.', { autoClose: 3000 });
      return;
    }

    localStorage.setItem('buyNow', JSON.stringify(product));
    navigate('/payment');
  };

  if (loading) return <p className="text-center text-gray-300">Loading product details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="h-48 w-full object-contain rounded bg-white p-2 mb-4"
        />

        <h2 className="text-3xl font-bold text-red-500 mb-4">{product.name}</h2>
        <p className="text-lg text-gray-300 mb-2">💰 Price: ${product.price?.toFixed(2)}</p>
        <p className="text-lg text-gray-400 mb-2">🏷️ Brand: {product.brand}</p>
        <p className="text-lg text-gray-400 mb-2">🎨 Color: {product.color}</p>
        <p className="text-lg text-gray-400 mb-2">📦 Stock: {product.stock}</p>
        <p className="text-lg text-gray-400 mb-2">🚗 Category: {product.category}</p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => handleBuyNow(product)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaStar /> Buy Now
          </button>
          <button
            onClick={() => handleAddToCart(product)}
            className="bg-white text-black hover:bg-red-500 hover:text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaStar /> Add to Cart
          </button>
        </div>

        <h3 className="text-2xl font-semibold mt-8 mb-2">🗣️ Reviews</h3>

        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <ReviewItem
              key={index}
              index={index}
              review={{
                ...review,
                canDelete: review.user === JSON.parse(localStorage.getItem('user'))?.name,
              }}
              highlighted={highlightedIndex === index}
              onDelete={handleReviewDelete}
              reviewRef={(el) => (reviewRefs.current[index] = el)}
            />
          ))
        ) : (
          <p className="text-gray-400">No reviews yet.</p>
        )}

        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-2">Write a Review</h4>
          <StarRating rating={rating} setRating={setRating} />
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="4"
            className="w-full bg-gray-800 text-white p-3 rounded mb-4"
            placeholder="Write your review..."
          ></textarea>
          <button
            onClick={handleReviewSubmit}
            disabled={submitting}
            className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaStar /> {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
