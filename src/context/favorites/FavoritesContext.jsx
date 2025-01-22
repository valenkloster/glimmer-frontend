import { createContext, useState, useEffect } from 'react';
import { favoriteService } from '../../services/favoritesService';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar favoritos cuando cambia el token
  const loadFavorites = async () => {
    const token = localStorage.getItem('token');
    
    // Si no hay token, limpiar favoritos
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

  // Escuchar cambios en el token
  useEffect(() => {
    // Crear un observer para el localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        loadFavorites();
      }
    };

    // Suscribirse a cambios en el localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Cargar favoritos inicialmente
    loadFavorites();

    // Limpiar el listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addToFavorites = async (productId) => {
    try {
      await favoriteService.add(productId);
      await loadFavorites(); // Recargar la lista de favoritos
    } catch (err) {
      setError('Error al agregar a favoritos');
      console.error('Error adding to favorites:', err);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      await favoriteService.remove(productId);
      await loadFavorites(); // Recargar la lista de favoritos
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
    loadFavorites // Exponemos loadFavorites para poder llamarlo manualmente si es necesario
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};