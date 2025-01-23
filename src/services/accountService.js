import { httpClient } from './httpClient';

export const accountService = {
  getClientInfo: () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return httpClient.get(`/api/v1/clientes/${userData.id_user}`);
  }
};