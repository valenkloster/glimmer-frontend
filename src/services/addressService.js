import { httpClient } from './httpClient';

export const addressService = {
  getProvincias: () => 
    httpClient.get('/api/v1/provincias'),
  
  createAddress: (addressData) => 
    httpClient.post('/api/v1/cliente_direcciones', addressData),

  getAddresses: () =>
    httpClient.get('/api/v1/cliente_direcciones'),
    
  deleteAddress: (id_direccion) =>
    httpClient.delete('/api/v1/cliente_direcciones', id_direccion)
};