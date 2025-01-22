import { createContext, useState, useEffect } from 'react';
import { favoriteService } from '../../services/favoritesService';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFavorites = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await favoriteService.getAll();
      setFavorites(response.body);
      setError(null);
    } catch (err) {
      setError('Error al cargar favoritos');
      console.error('Error loading favorites:', err);
      setFavorites([]); // Limpiar favoritos en caso de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    loadFavorites();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addToFavorites = async (productId) => {
    try {
      await favoriteService.add(productId);
      await loadFavorites();
    } catch (err) {
      setError('Error al agregar a favoritos');
      console.error('Error adding to favorites:', err);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      await favoriteService.remove(productId);
      await loadFavorites();
    } catch (err) {
      setError('Error al eliminar de favoritos');
      console.error('Error removing from favorites:', err);
    }
  };

  const isProductFavorite = (productId) => {
    return favorites?.some(fav => fav.id_producto === productId);
  };

  const contextValue = {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isProductFavorite,
    loadFavorites
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};