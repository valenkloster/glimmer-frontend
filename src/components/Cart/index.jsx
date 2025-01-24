import { useContext, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { CartContext } from '../../context/cart/CartContext';
import CartItem from '../CartItem';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { httpClient } from '../../services/httpClient';
import { useLocation } from 'react-router-dom';


const Cart = () => {
 const [preferenceId, setPreferenceId] = useState(null);
 const [paymentLoading, setPaymentLoading] = useState(false);
 const [paymentError, setPaymentError] = useState(null);
 const location = useLocation();


 const { 
   cart,
   loading,
   error,
   isCartOpen,
   cartTotal,
   updateQuantity,
   removeFromCart,
   closeCart
 } = useContext(CartContext);

 useEffect(() => {
   initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {locale: 'es-AR'});
 }, []);

 const createPayment = async (id_direccion) => {
   try {
     setPaymentLoading(true);
     setPaymentError(null);
     const { body } = await httpClient.post('/api/v1/pagos/create-preference', { 
       id_direccion 
     });
     setPreferenceId(body.id);
     return body;
   } catch (error) {
     setPaymentError(error.message);
     throw error;
   } finally {
     setPaymentLoading(false);
   }
 };

 const handleCheckout = async () => {
   try {
     const id_direccion = 1;
     await createPayment(id_direccion);
   } catch (error) {
     console.error('Error al crear preferencia:', error);
   }
 };

 if (!isCartOpen) return null;

 return (
    <aside 
      className={`
        fixed right-0 top-[81px] w-full max-w-[500px] h-[calc(100vh-81px)]
        border border-black rounded-lg bg-white shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
        z-50 flex flex-col
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b">
        <h2 className="font-medium text-lg sm:text-xl">Mi Carrito</h2>
        <div>
          <XMarkIcon
            className="h-6 w-6 text-black cursor-pointer hover:text-gray-700"
            onClick={closeCart}
          />
        </div>
      </div>

      {/* Content - Scrolleable Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        )}
        {error && (
          <p className="text-red-500 p-4 text-center">{error}</p>
        )}
        {cart?.detalles?.map((item) => (
          <CartItem
            key={item.id_carrito_detalle}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
        {!loading && !cart?.detalles?.length && (
          <p className="text-center py-4 text-gray-500">No hay productos en el carrito</p>
        )}
      </div>

      {/* Footer - Total and Button */}
      <div className="px-4 sm:px-6 py-4 border-t bg-white">
       <p className="flex justify-between items-center mb-2">
         <span className="font-light text-sm sm:text-base">Total:</span>
         <span className="font-medium text-lg sm:text-2xl">
           ${parseFloat(cartTotal).toFixed(2)}
         </span>
       </p>
       <button 
         className={`
          w-full rounded-lg text-sm sm:text-base py-2 sm:py-3
          transition-colors duration-200
          ${!cart?.detalles?.length 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-900'
          }
        `}
         disabled={!cart?.detalles?.length || paymentLoading}
         onClick={handleCheckout}
       >
         {paymentLoading ? 'Procesando...' : 'Finalizar Compra'}
       </button>

       {preferenceId && (
        <Wallet
          initialization={{ preferenceId }}
          onError={(error) => console.error('Error:', error)}
        />
      )}
     </div>
   </aside>
 );
};

export default Cart;