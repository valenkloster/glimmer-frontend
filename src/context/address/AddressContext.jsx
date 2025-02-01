import { createContext, useState, useEffect } from 'react';
import { addressService } from '../../services/addressService';

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [provincias, setProvincias] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [shippingCost, setShippingCost] = useState(0);
   const [shippingLoading, setShippingLoading] = useState(false);
   const [shippingError, setShippingError] = useState(null);

  const loadAddresses = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
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
      setError('Error al cargar direcciones');
      console.error('Error loading addresses:', err);
      setAddresses([]); // Clear addresses in case of error
      setSelectedAddress(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch provinces
  const fetchProvincias = async () => {
    try {
      const response = await addressService.getProvincias();
      setProvincias(response.body);
    } catch (err) {
      console.error('Error loading provinces:', err);
    }
  };

  useEffect(() => {
    // Listen for token changes in other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        loadAddresses();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Initial load of addresses
    loadAddresses();

    // Fetch provinces
    fetchProvincias();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Create a new address
  const createAddress = async (addressData) => {
    try {
      await addressService.createAddress(addressData);
      await loadAddresses();
    } catch (err) {
      setError('Error al crear dirección');
      console.error('Error creating address:', err);
      throw err;
    }
  };

  // Delete an address
  const deleteAddress = async (id_direccion) => {
    try {
      await addressService.deleteAddress(id_direccion);
      await loadAddresses();
    } catch (err) {
      setError('Error al eliminar dirección');
      console.error('Error deleting address:', err);
      throw err;
    }
  };

  const calculateShipping = async (items) => {
    if (!selectedAddress) {
      setShippingError('No hay dirección seleccionada');
      return;
    }
  
    try {
      setShippingLoading(true);
      setShippingError(null);
  
      const shippingData = {
        items: items,
        direction: {
          city: selectedAddress.direccion.localidad.nombre,
          state: selectedAddress.direccion.localidad.provincia.nombre,
          zipcode: selectedAddress.direccion.codigo_postal
        }
      };
  
      console.log('Enviando al servidor:', shippingData);
      const response = await addressService.calculateShipping(shippingData.items, shippingData.direction);
      setShippingCost(response.body);
      return response.body;
  
    } catch (err) {
      setShippingError('Error al calcular el costo de envío');
      console.error('Error calculating shipping:', err);
      throw err;
    } finally {
      setShippingLoading(false);
    }
  };

  const contextValue = {
    provincias,
    addresses,
    selectedAddress,
    setSelectedAddress,
    loading,
    error,
    createAddress,
    deleteAddress,
    loadAddresses,
    fetchProvincias,
    calculateShipping,
    shippingCost,
    shippingLoading,
    shippingError
  };

  return (
    <AddressContext.Provider value={contextValue}>
      {children}
    </AddressContext.Provider>
  );
};