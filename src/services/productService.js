import { httpClient } from './httpClient';

export const productService = {
  getAll: (options = {}) => 
    httpClient.get('/api/v1/productos', options),

  getById: (id, options = {}) => 
    httpClient.get(`/api/v1/productos/${id}`, options),

  getByCategory: (categoryId, options = {}) => 
    httpClient.get(`/api/v1/productos/categoria/${categoryId}`, options),

  searchProducts: (searchQuery, options = {}) => 
    httpClient.get(
      `/api/v1/productos/busqueda?query=${encodeURIComponent(searchQuery)}`,
      options
    ),

  getLowStock: (options = {}) => 
    httpClient.get('/api/v1/productos/low-stock', options),

  updateStock: (id, stock, options = {}) => 
    httpClient.patch(`/api/v1/productos/${id}/stock`, { stock }, options)
};