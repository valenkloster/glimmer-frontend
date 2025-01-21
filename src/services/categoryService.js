import { httpClient } from './httpClient';

export const categoryService = {
  getAll: () => httpClient.get('/api/v1/categorias')
};