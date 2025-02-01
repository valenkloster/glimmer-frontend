import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../context/cart/CartContext';
import { AddressContext } from '../../context/address/AddressContext';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { httpClient } from '../../services/httpClient';

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartTotal, loading: cartLoading } = useContext(CartContext);
  const { selectedAddress, loading: addressLoading } = useContext(AddressContext);

  const [preferenceId, setPreferenceId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const shippingCost = location.state?.shippingCost || 0;
  const totalWithShipping = cartTotal + shippingCost;

  useEffect(() => {
    if (!selectedAddress || !cart) {
      navigate('/checkout');
      return;
    }
    
    initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {locale: 'es-AR'});
  }, [selectedAddress, cart, navigate]);

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      setPaymentError(null);
      
      // Guardamos los datos necesarios en localStorage
      localStorage.setItem('selectedAddressId', selectedAddress.id_direccion);
      localStorage.setItem('shippingCost', shippingCost);
      localStorage.setItem('productsTotal', cartTotal);
  
      const { body } = await httpClient.post('/api/v1/pagos/create-payment', {
        shippingCost: shippingCost
      });
      setPreferenceId(body.id);
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    } finally {
      setPaymentLoading(false);
    }
  };

  if (cartLoading || addressLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-[80px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[80px]">
      <section className="bg-nude py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-light mb-3 text-center">
            Resumen de tu pedido
          </h1>
        </div>
      </section>

      <section className="flex-1 py-8 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          {/* Dirección de envío */}
          <div className="mb-8">
            <h2 className="text-xl font-product mb-4">Dirección de envío</h2>
            <div className="bg-nude p-6 rounded-xl shadow-sm">
              <p>{selectedAddress?.direccion?.direccion}</p>
              <p>{selectedAddress?.direccion?.localidad?.nombre}, {selectedAddress?.direccion?.localidad?.provincia?.nombre}, {selectedAddress?.direccion?.localidad?.provincia?.pais?.nombre}</p>
              <p>{selectedAddress?.direccion?.codigo_postal}</p>
            </div>
          </div>

          {/* Productos */}
          <div className="mb-8">
            <h2 className="text-xl font-product mb-4">Productos</h2>
            <div className="bg-nude p-6 rounded-xl shadow-sm">
              {cart?.detalles?.map((item) => (
                <div key={item.id_carrito_detalle} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.producto.imagen} 
                      alt={item.producto.nombre} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.producto.nombre}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                    </div>
                  </div>
                  <p className="font-medium">
                    ${(item.cantidad * item.producto.precio).toLocaleString('es-AR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de costos */}
          <div className="mb-8">
            <h2 className="text-xl font-product mb-4">Resumen</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between mb-2">
                <p>Subtotal:</p>
                <p className="font-medium">${cartTotal.toLocaleString('es-AR')}</p>
              </div>
              <div className="flex justify-between mb-2">
                <div>
                    <p>Costo de envío</p>
                    <p className="text-sm text-gray-500">(IVA incluido)</p>
                </div>
                <p className="font-medium">${shippingCost.toLocaleString('es-AR')}</p>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-medium">
                  <p>Total:</p>
                  <p>${totalWithShipping.toLocaleString('es-AR')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de pago */}
          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            className={`w-full py-3 px-6 rounded-full text-white transition-all duration-300 
              ${paymentLoading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-verde-agua hover:bg-opacity-90 cursor-pointer'}`}
          >
            {paymentLoading ? 'Procesando...' : 'Pagar con Mercado Pago'}
          </button>

          {paymentError && (
            <p className="text-red-500 text-center mt-4">{paymentError}</p>
          )}

          {preferenceId && (
            <div className="mt-4">
              <Wallet
                initialization={{ preferenceId }}
                onError={(error) => console.error('Error:', error)}
              />
            </div>
          )}
        </div>
      </section>
      
      <section className="bg-nude py-8" />
    </div>
  );
};

export default OrderSummaryPage;