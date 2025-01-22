import { createContext, useState } from 'react';
import { reviewService } from '../../services/reviewService';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);

  const loadReviews = async (productId) => {
    try {
      setLoading(true);
      const response = await reviewService.getByProduct(productId);
      
      if (typeof response.body === 'string' && response.body === 'This product has no reviews') {
        setReviews([]);
      } else {
        const filteredReviews = filter
          ? response.body.filter(review => review.puntaje === filter)
          : response.body;
        setReviews(filteredReviews);
      }
      setError(null);
    } catch (err) {
      setError('Error al cargar las reseñas');
      console.error('Error loading reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (productId, rating, description) => {
    try {
      setLoading(true);
      const response = await reviewService.create(productId, description, rating);
      
      // En lugar de agregar directamente la respuesta, volvemos a cargar las reseñas
      await loadReviews(productId);
      setError(null);
    } catch (err) {
      setError('Error al agregar la reseña');
      console.error('Error adding review:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = (stars) => {
    setFilter(stars);
  };

  const contextValue = {
    reviews,
    loading,
    error,
    filter,
    loadReviews,
    addReview,
    filterReviews
  };

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
    </ReviewContext.Provider>
  );
};