import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    id_producto: productId
  });
  const [averageRating, setAverageRating] = useState(0);
  
  // Simular autenticación por ahora
  const isAuthenticated = true; // Esto se reemplazará con tu sistema de auth real

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/resenias/${productId}`);
      const data = await response.json();
      setReviews(data);
      calculateAverageRating(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const calculateAverageRating = (reviewsData) => {
    if (reviewsData.length === 0) return;
    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    setAverageRating((sum / reviewsData.length).toFixed(1));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Por favor inicia sesión para dejar una reseña');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/resenias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        fetchReviews();
        setNewReview({ rating: 0, comment: '', id_producto: productId });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type={interactive ? 'button' : undefined}
        className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={() => interactive && setNewReview({ ...newReview, rating: index + 1 })}
      >
        {index < (interactive ? newReview.rating : rating) ? (
          <StarIcon className="h-5 w-5 text-yellow-400" />
        ) : (
          <StarOutline className="h-5 w-5 text-yellow-400" />
        )}
      </button>
    ));
  };

  return (
    <div className="mt-16 max-w-2xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-8 font-serif">Opiniones de clientes</h2>
      
      {/* Resumen de calificaciones */}
      <div className="flex items-center mb-8">
        <div className="flex items-center">
          <span className="text-3xl font-bold mr-2">{averageRating}</span>
          <div className="flex">{renderStars(averageRating)}</div>
        </div>
        <span className="ml-4 text-sm text-gray-500">
          Basado en {reviews.length} opiniones
        </span>
      </div>

      {/* Formulario para nueva reseña */}
      {isAuthenticated && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 font-serif">Escribir una reseña</h3>
          <div className="mb-4">
            <label className="block mb-2">Tu calificación</label>
            <div className="flex gap-1">
              {renderStars(newReview.rating, true)}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Tu comentario</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows="4"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Publicar reseña
          </button>
        </form>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-center mb-2">
              <span className="font-semibold mr-2">{review.usuario || 'Usuario'}</span>
              <div className="flex">{renderStars(review.rating)}</div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
            <p className="text-gray-800">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;