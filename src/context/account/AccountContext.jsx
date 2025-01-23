import { createContext, useState, useEffect } from 'react';
import { accountService } from '../../services/accountService';

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [clientName, setClientName] = useState('');

  const loadClientName = async () => {
    try {
      const response = await accountService.getClientInfo();
      setClientName(`${response.body.nombre} ${response.body.apellido}`);
    } catch (err) {
      console.error('Error loading client info:', err);
    }
  };

  useEffect(() => {
    loadClientName();
  }, []);

  return (
    <AccountContext.Provider value={{ clientName, loadClientName }}>
      {children}
    </AccountContext.Provider>
  );
};