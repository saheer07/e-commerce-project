// components/ReviewItem.jsx
import React from 'react';
import StarRating from './StarRating';

const ReviewItem = React.memo(({ review, index, highlighted, onDelete, reviewRef }) => {
  return (
    <div
      ref={reviewRef}
      className={`border-b border-gray-700 py-2 transition-colors duration-500 ${
        highlighted ? 'bg-yellow-200 text-black rounded' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <StarRating rating={review.rating} isEditable={false} />
        <span className="text-gray-300">{review.rating} Stars</span>
      </div>
      <p className="text-gray-400">{review.comment}</p>
      <p className="text-sm text-gray-500">— {review.user}</p>

      {review.canDelete && (
        <button
          onClick={() => onDelete(index)}
          className="text-red-500 hover:text-red-700 mt-2"
        >
          Delete Review
        </button>
      )}
    </div>
  );
});

export default ReviewItem;
