import React, { createContext, useContext, useState } from 'react';
import { paymentService } from '../../services/paymentService';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);

  const createPreference = async (id_direccion) => {
    try {
      setLoading(true);
      setError(null);
      const { body } = await paymentService.createPreference(id_direccion);
      setPreferenceId(body.id);
      return body;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await paymentService.processPayment(paymentData);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentContext.Provider value={{ 
      loading, 
      error, 
      preferenceId,
      createPreference,
      processPayment 
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment debe ser usado dentro de un PaymentProvider');
  }
  return context;
};