import { useContext, useState, useCallback } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { FavoritesContext } from '../../context/favorites/FavoritesContext';
import { AuthContext } from '../../context/auth/AuthContext';
import { LoginAlert } from '../LoginAlert';

export const FavoriteButton = ({ productId, productData = null }) => {
  const { 
    addToFavorites, 
    removeFromFavorites, 
    isProductFavorite,
    isUpdating 
  } = useContext(FavoritesContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);
  
  const isFavorite = isProductFavorite(productId);
  const isLoading = isUpdating(productId);

  const handleClick = useCallback(async (event) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (isLoading) return;

    if (isFavorite) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId, productData);
    }
  }, [isAuthenticated, isLoading, isFavorite, productId, productData, addToFavorites, removeFromFavorites]);

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          absolute top-0 right-[44px] flex justify-center items-center 
          w-6 h-6 rounded-full m-4 p-1 transition-colors duration-200
          ${isFavorite ? 'bg-red-500' : 'bg-verde-agua'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
      >
        {isFavorite ? (
          <HeartSolid className='h-4 w-4 text-white' />
        ) : (
          <HeartOutline className='h-4 w-4 text-white' />
        )}
      </button>
      {showAlert && <LoginAlert text="agregar productos a favoritos" />}
    </>
  );
};