import { useContext } from 'react';
import { AddressProvider, AddressContext } from '../../context/address/AddressContext';
import { Address } from '../../components/Address';
import { AddressList } from '../../components/AddressList';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartContext } from '../../context';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { selectedAddress } = useContext(AddressContext);
  const { setShippingAddress } = useContext(ShoppingCartContext);

  const handlePayment = () => {
    if (!selectedAddress) return;
    setShippingAddress(selectedAddress);
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ marginTop: '81px' }}>
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
                   disabled={!selectedAddress}
                   className={`w-full mt-4 py-3 px-6 rounded-full text-white transition-all duration-300 ${
                     selectedAddress 
                       ? 'bg-verde-agua hover:bg-opacity-90 cursor-pointer' 
                       : 'bg-gray-300 cursor-not-allowed'
                   }`}
                 >
                   {selectedAddress ? '¡Continuar con el pago! →' : 'Selecciona una dirección para continuar'}
                 </button>
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