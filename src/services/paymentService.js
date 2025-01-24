import { httpClient } from './httpClient';

export const paymentService = {
  createPayment: (id_direccion) => httpClient.post('/api/v1/pagos/create-preference', { 
    id_direccion }),
  
  processPayment: (payment_id, id_direccion) => httpClient.post('/api/v1/pagos/process-payment', {
    payment_id,
    id_direccion
  })      
};