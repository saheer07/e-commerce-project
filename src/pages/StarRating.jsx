import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating, isEditable = true }) => {
  const handleClick = (newRating) => {
    if (isEditable) {
      setRating(newRating);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
          onClick={() => handleClick(star)}
          size={24}
        />
      ))}
    </div>
  );
};

export default StarRating;
