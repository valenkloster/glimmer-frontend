import { translateError } from './errorMessages';

const baseURL = import.meta.env.VITE_API_URL;

export const authService = {
  requestPasswordReset: async (email) => {
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/recovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(translateError(data.body) || 'Error al solicitar el cambio de contraseña');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  validatePassword: (password) => {
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      authService.validatePassword(newPassword);
      const response = await fetch(`${baseURL}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(translateError(data.body) || 'Error al cambiar la contraseña');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },
  login: async (email, password) => {
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(translateError(data.body) || 'Error en el inicio de sesión');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${baseURL}/api/v1/clientes/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(translateError(data.body) || 'Error en el registro');
      }
  
      return data;
    } catch (error) {
      throw error;
    }
  }
};