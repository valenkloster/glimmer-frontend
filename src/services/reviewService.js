import { httpClient } from './httpClient';

export const reviewService = {
  getByProduct: (productId) => 
    httpClient.get(`/api/v1/resenias/${productId}`),
  
  create: (id_producto, descripcion, puntaje) => 
    httpClient.post('/api/v1/resenias', {
      id_producto,
      descripcion,
      puntaje
    })
};