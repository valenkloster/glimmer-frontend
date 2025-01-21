const baseURL = import.meta.env.VITE_API_URL;

const createHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = localStorage.getItem('jwt');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const httpClient = {
  async get(endpoint) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      headers: createHeaders()
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async delete(endpoint, data) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }
};