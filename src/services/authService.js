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
        throw new Error(data.message || 'Error al solicitar el cambio de contraseña');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al cambiar la contraseña');
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
        throw new Error(data.message || 'Error en el inicio de sesión');
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
        throw new Error(data.message || 'Error en el registro');
      }
  
      return data;
    } catch (error) {
      throw error;
    }
  },

  validateToken: async (token) => {
    try {
      const response = await fetch(`${baseURL}/api/v1/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Token inválido');
      }

      return true;
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  }
};