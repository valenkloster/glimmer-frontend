import { httpClient } from './httpClient';

export const orderService = {
  getAll: () => httpClient.get('/api/v1/pedidos'),

  getAllOrders: (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.estado) queryParams.append('estado', filters.estado);
    if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);
    
    return httpClient.get(`/api/v1/pedidos/all?${queryParams.toString()}`);
  },  
  
  getById: (orderId) => httpClient.get(`/api/v1/pedidos/${orderId}`),

  getMonthStats: (month, year) => httpClient.get(`/api/v1/pedidos/month-stats?month=${month}&year=${year}`),

  getTop5Products: (month, year) => httpClient.get(`/api/v1/pedidos/top-products?month=${month}&year=${year}`),

  updateOrderStatus: (orderId, statusId) => httpClient.patch(`/api/v1/pedidos/${orderId}/status`, {
    id_estado_pedido: statusId
  })

};