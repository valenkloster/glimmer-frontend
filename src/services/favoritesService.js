import { httpClient } from './httpClient';

export const favoriteService = {
  getAll: () => httpClient.get('/api/v1/favoritos'),
  
  add: (productId) => httpClient.post('/api/v1/favoritos', {
    id_producto: productId
  }),
  
  remove: (productId) => httpClient.delete('/api/v1/favoritos', {
    id_producto: productId
  })
};