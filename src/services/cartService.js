import { httpClient } from './httpClient';

export const cartService = {
  getAll: () => httpClient.get('/api/v1/carrito'),
  
  add: (productId, quantity) => httpClient.post('/api/v1/carrito/add', {
    id_producto: productId,
    cantidad: quantity
  }),
  
  update: (productId, quantity) => httpClient.patch('/api/v1/carrito/update', {
    id_producto: productId,
    cantidad: quantity
  }),

  remove: (productId) => httpClient.delete(`/api/v1/carrito/remove/${productId}`)
};