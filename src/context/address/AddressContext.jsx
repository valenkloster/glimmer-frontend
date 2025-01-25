import { createContext, useContext, useState, useEffect } from 'react';
import { addressService } from '../../services/addressService';

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [provincias, setProvincias] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchProvincias = async () => {
    try {
      setLoading(true);
      const response = await addressService.getProvincias();
      setProvincias(response.body);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    const currentToken = localStorage.getItem('token');
    
    if (!currentToken) {
      setAddresses([]);
      setSelectedAddress(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await addressService.getAddresses();
      setAddresses(response.body);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAddresses([]);
      setSelectedAddress(null);
    } finally {
      setLoading(false);
    }
  };

  // Observar cambios en el token
  useEffect(() => {
    const checkToken = () => {
      const newToken = localStorage.getItem('token');
      if (newToken !== token) {
        setToken(newToken);
        fetchAddresses();
      }
    };

    window.addEventListener('storage', checkToken);
    const interval = setInterval(checkToken, 1000);
    
    return () => {
      window.removeEventListener('storage', checkToken);
      clearInterval(interval);
    };
  }, [token]);

  const createAddress = async (addressData) => {
    try {
      setLoading(true);
      const response = await addressService.createAddress(addressData);
      await fetchAddresses();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id_direccion) => {
    try {
      setLoading(true);
      const response = await addressService.deleteAddress(id_direccion);
      await fetchAddresses();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddressContext.Provider 
      value={{ 
        provincias,
        addresses,
        selectedAddress,
        setSelectedAddress,
        loading,
        error,
        fetchProvincias,
        createAddress,
        fetchAddresses,
        deleteAddress
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};