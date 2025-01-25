import { httpClient } from './httpClient';

export const orderService = {
  getAll: () => httpClient.get('/api/v1/pedidos'),
  
  getById: (orderId) => httpClient.get(`/api/v1/pedidos/${orderId}`)
};