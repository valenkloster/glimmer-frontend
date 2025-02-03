import { useContext, useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { ReviewContext } from '../../context/review/reviewContext';
import { AuthContext } from '../../context/auth/AuthContext';
import { OrderContext } from '../../context/order/OrderContext';
import { LoginAlert } from '../LoginAlert';

const Reviews = ({ productId }) => {
  const { 
    reviews, 
    loading, 
    error, 
    filter,
    loadReviews, 
    addReview,
    filterReviews
  } = useContext(ReviewContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { orders, fetchOrders } = useContext(OrderContext);
  
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const checkIfUserOrdered = async () => {
        await fetchOrders();
        
        const hasBoughtProduct = orders.some(order => 
          order.detalles?.some(detalle => 
            detalle.id_producto === parseInt(productId)
          )
        );
        
        console.log('¿Ha comprado el producto?', hasBoughtProduct);
        setHasOrdered(hasBoughtProduct);
      };
      checkIfUserOrdered();
    }
  }, [isAuthenticated, productId]);

  useEffect(() => {
    loadReviews(productId);
  }, [productId, filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview(productId, rating, description);
      setRating(0);
      setDescription('');
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 3000);
      return;
    }
   
    if (!hasOrdered) {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 3000);
      return;
    }

    setShowForm(true);
  };

  const renderStars = (value, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const filled = interactive 
        ? (hoveredStar ?? rating) >= starValue
        : value >= starValue;

      const StarComponent = filled ? StarIcon : StarOutline;
      
      return (
        <button
          key={index}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => setRating(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoveredStar(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredStar(null) : undefined}
          className={`h-6 w-6 ${filled ? 'text-yellow-400' : 'text-gray-300'} ${
            interactive ? 'cursor-pointer' : ''
          }`}
        >
          <StarComponent />
        </button>
      );
    });
  };

  return (
    <div className="mt-8 mb-20">
      {showLoginAlert && 
        <LoginAlert 
          text={
            isAuthenticated 
              ? "dejar reseñas en productos que hayas comprado" 
              : "escribir reseñas"
          } 
        />
      }
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Reseñas</h3>
        <button
          onClick={handleWriteReviewClick}
          className="bg-verde-agua text-white px-4 py-2 rounded-full hover:bg-opacity-90"
        >
          Escribir reseña
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => filterReviews(null)}
          className={`px-3 py-1 rounded-full ${
            filter === null ? 'bg-verde-agua text-white' : 'bg-gray-100'
          }`}
        >
          Todas
        </button>
        {[5, 4, 3, 2, 1].map(stars => (
          <button
            key={stars}
            onClick={() => filterReviews(stars)}
            className={`px-3 py-1 rounded-full flex items-center gap-1 ${
              filter === stars ? 'bg-verde-agua text-white' : 'bg-gray-100'
            }`}
          >
            {stars} <StarIcon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* Formulario de reseña */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold">Escribir una reseña</h4>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2 mb-4">
                <span>Tu calificación:</span>
                <div className="flex">
                  {renderStars(rating, true)}
                </div>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Escribe tu reseña aquí..."
                className="w-full p-2 border rounded-lg mb-4"
                rows="4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-full border hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={rating === 0 || !description.trim()}
                  className="bg-verde-agua text-white px-4 py-2 rounded-full hover:bg-opacity-90 disabled:opacity-50"
                >
                  Publicar reseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de reseñas */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-verde-agua"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center text-gray-500 space-y-4">
              <p>No hay reseñas aún.</p>
              {!isAuthenticated && (
                <p className="text-sm">
                  Inicia sesión para ser el primero en opinar
                </p>
              )}
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id_resenia} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">
                    {review.cliente?.nombre} {review.cliente?.apellido}
                  </span>
                  <div className="flex">
                    {renderStars(review.puntaje)}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(review.fecha).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-gray-700">{review.descripcion}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Reviews;