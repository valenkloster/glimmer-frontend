import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../../services/authService';
import { FavoritesContext } from '../favorites/FavoritesContext';
import { CartContext } from '../cart/CartContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Obtener loadFavorites del FavoritesContext
  const favoritesContext = useContext(FavoritesContext);
  const cartContext = useContext(CartContext);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
  
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        // Cargar favoritos al verificar el estado de autenticación
        favoritesContext?.loadFavorites?.();
        cartContext?.loadCart?.();
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      
      // Cargar favoritos después del login exitoso
      favoritesContext?.loadFavorites?.();
      cartContext?.loadCart?.();

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      await authService.register(userData);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    
    // Limpiar favoritos al hacer logout
    favoritesContext?.loadFavorites?.();
    cartContext?.loadCart?.();
    cartContext?.closeCart?.();
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register,
    updateUser,
    checkAuthStatus
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F2ED]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5EA692]"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};