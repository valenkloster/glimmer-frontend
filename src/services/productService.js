import { httpClient } from './httpClient';

export const productService = {
  getAll: () => httpClient.get('/api/v1/productos'),
  getById: (id) => httpClient.get(`/api/v1/productos/${id}`),
  getByCategory: (categoryId) => httpClient.get(`/api/v1/productos/categoria/${categoryId}`)
};