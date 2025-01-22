import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

const AverageRating = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;
  
  const average = reviews.reduce((acc, review) => acc + review.puntaje, 0) / reviews.length;
  const totalReviews = reviews.length;
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          const StarComponent = index < Math.round(average) ? StarIcon : StarOutline;
          return (
            <StarComponent
              key={index}
              className={`h-5 w-5 ${
                index < Math.round(average) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          );
        })}
      </div>
      <span className="text-sm text-gray-600">
        ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
      </span>
    </div>
  );
};

export default AverageRating;