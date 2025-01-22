import { useContext, useState } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { FavoritesContext } from '../../context/favorites/FavoritesContext';
import { AuthContext } from '../../context/auth/AuthContext';
import { LoginAlert } from '../LoginAlert';

export const FavoriteButton = ({ productId }) => {
  const { addToFavorites, removeFromFavorites, isProductFavorite } = useContext(FavoritesContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);
  
  const isFavorite = isProductFavorite(productId);

  const handleClick = (event) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (isFavorite) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`absolute top-0 right-[44px] flex justify-center items-center w-6 h-6 rounded-full m-4 p-1 ${
          isFavorite ? 'bg-red-500' : 'bg-verde-agua'
        }`}
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