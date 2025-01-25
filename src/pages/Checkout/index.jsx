import { useContext, useEffect, useState } from 'react';
import { AddressContext } from '../../context/address/AddressContext';
import { Address } from '../../components/Address';
import { AddressList } from '../../components/AddressList';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { httpClient } from '../../services/httpClient';

const CheckoutPage = () => {
    const { selectedAddress } = useContext(AddressContext);
    
    const [preferenceId, setPreferenceId] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
  
    useEffect(() => {
      initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {locale: 'es-AR'});
    }, []);
  
    const handlePayment = async () => {
      if (!selectedAddress || selectedAddress <= 0) return;
      
      try {
        setPaymentLoading(true);
        setPaymentError(null);
        localStorage.setItem('selectedAddressId', selectedAddress.id_direccion);
        const { body } = await httpClient.post('/api/v1/pagos/create-payment');
        setPreferenceId(body.id);
      } catch (error) {
        setPaymentError(error.message);
        throw error;
      } finally {
        setPaymentLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[80px]">
      <section className="bg-nude py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-light mb-3 text-center">
            ¡Estás a un paso de completar tu compra! 🎉
          </h1>
          <p className="text-gray-600 text-center text-lg font-light">
            Selecciona dónde quieres recibir tu pedido o agrega una nueva dirección
          </p>
        </div>
      </section>

      <section className="flex-1 py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 h-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
              <div className="flex flex-col h-full">
                <h2 className="text-xl font-light mb-4">Crear nueva dirección</h2>
                <div className="bg-white p-6 rounded-xl shadow-sm flex-1">
                  <Address />
                </div>
              </div>
              
              <div className="flex flex-col h-full">
                <h2 className="text-xl font-light mb-4">Seleccionar dirección guardada</h2>
                <div className="bg-white p-6 rounded-xl shadow-sm flex-1">
                  <div className="flex flex-col h-full justify-between">
                    <AddressList />
                    <button
                        onClick={handlePayment}
                        disabled={!selectedAddress || paymentLoading}
                        className={`w-full mt-4 py-3 px-6 rounded-full text-white transition-all duration-300 ${
                        selectedAddress && !paymentLoading
                            ? 'bg-verde-agua hover:bg-opacity-90 cursor-pointer' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {paymentLoading 
                        ? 'Procesando...' 
                        : selectedAddress
                            ? '¡Continuar con el pago! →' 
                            : 'Selecciona una dirección para continuar'}
                    </button>

                    {preferenceId && (
                        <Wallet
                        initialization={{ preferenceId }}
                        onError={(error) => console.error('Error:', error)}
                        />
                    )}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>
      
      <section className="bg-nude py-8" />
    </div>
  );
};

export default CheckoutPage;