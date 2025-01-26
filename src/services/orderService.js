import { httpClient } from './httpClient';

export const orderService = {
  getAll: () => httpClient.get('/api/v1/pedidos'),
  
  getById: (orderId) => httpClient.get(`/api/v1/pedidos/${orderId}`),

  getMonthStats: (month, year) => httpClient.get(`/api/v1/pedidos/month-stats?month=${month}&year=${year}`),

  getTop5Products: (month, year) => httpClient.get(`/api/v1/pedidos/top-products?month=${month}&year=${year}`)

};