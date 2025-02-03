import { createContext, useState, useEffect, useCallback } from 'react';
import { favoriteService } from '../../services/favoritesService';

export const FavoritesContext = createContext();

const FAVORITES_CACHE = new Set();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const loadFavorites = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setFavorites([]);
      setLoading(false);
      FAVORITES_CACHE.clear();
      return;
    }

    try {
      setLoading(true);
      const response = await favoriteService.getAll();
      setFavorites(response.body);
      
      // Actualizar cache
      FAVORITES_CACHE.clear();
      response.body.forEach(fav => FAVORITES_CACHE.add(fav.id_producto));
      
      setError(null);
    } catch (err) {
      setError('Error al cargar favoritos');
      console.error('Error loading favorites:', err);
      setFavorites([]);
      FAVORITES_CACHE.clear();
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

  const addToFavorites = async (productId, productData = null) => {
    try {
      setUpdatingItems(prev => new Set(prev).add(productId));
      
      // Optimistic update
      setFavorites(prev => {
        const newFavorite = productData ? { id_producto: productId, ...productData } : { id_producto: productId };
        FAVORITES_CACHE.add(productId);
        return [...prev, newFavorite];
      });

      const response = await favoriteService.add(productId);
      
      if (response.error || response.status !== 200) {
        await loadFavorites(); // Revert if failed
      }
    } catch (err) {
      setError('Error al agregar a favoritos');
      await loadFavorites(); // Revert on error
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      setUpdatingItems(prev => new Set(prev).add(productId));

      // Optimistic update
      setFavorites(prev => {
        const newFavorites = prev.filter(fav => fav.id_producto !== productId);
        FAVORITES_CACHE.delete(productId);
        return newFavorites;
      });

      const response = await favoriteService.remove(productId);
      
      if (response.error || response.status !== 200) {
        await loadFavorites(); // Revert if failed
      }
    } catch (err) {
      setError('Error al eliminar de favoritos');
      await loadFavorites(); // Revert on error
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const isProductFavorite = useCallback((productId) => {
    // Usar el cache para verificación rápida
    return FAVORITES_CACHE.has(productId);
  }, []);

  const isUpdating = useCallback((productId) => {
    return updatingItems.has(productId);
  }, [updatingItems]);

  const contextValue = {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isProductFavorite,
    loadFavorites,
    isUpdating
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};