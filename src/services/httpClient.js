const baseURL = import.meta.env.VITE_API_URL;

const createHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    } catch (e) {
      throw new Error('Network response was not ok');
    }
  }
  return response.json();
};

export const httpClient = {
  async get(endpoint, options = {}) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      headers: createHeaders(),
      signal: options.signal
    });
    return handleResponse(response);
  },

  async post(endpoint, data, options = {}) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
      signal: options.signal
    });
    return handleResponse(response);
  },
  
  async patch(endpoint, data, options = {}) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: createHeaders(),
      body: JSON.stringify(data),
      signal: options.signal
    });
    return handleResponse(response);
  },

  async delete(endpoint, data, options = {}) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: createHeaders(),
      body: JSON.stringify(data),
      signal: options.signal
    });
    return handleResponse(response);
  }
};