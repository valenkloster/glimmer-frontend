import { httpClient } from './httpClient';

export const productService = {
  getAll: () => httpClient.get('/api/v1/productos'),
  getById: (id) => httpClient.get(`/api/v1/productos/${id}`),
  getByCategory: (categoryId) => httpClient.get(`/api/v1/productos/categoria/${categoryId}`),
  searchProducts: (searchQuery) => httpClient.get(`/api/v1/productos/busqueda?query=${encodeURIComponent(searchQuery)}`),
  getLowStock: () => httpClient.get('/api/v1/productos/low-stock'),
  updateStock: (id, stock) => httpClient.patch(`/api/v1/productos/${id}/stock`, { stock })

};