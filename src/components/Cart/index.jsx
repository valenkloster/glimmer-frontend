import { useContext } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { CartContext } from '../../context/cart/CartContext';
import CartItem from '../CartItem';
import './styles.css';

const Cart = () => {
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

  if (!isCartOpen) return null;

  return (
    <aside className="flex flex-col fixed right-0 border border-black rounded-lg bg-white shadow-lg sm:max-w-sm w-full checkout-side-menu z-50"> {/* Agregamos z-50 */}
      <div className="flex justify-between items-center p-4 sm:p-6">
        <h2 className="font-medium text-lg sm:text-xl">Mi Carrito</h2>
        <div>
          <XMarkIcon
            className="h-6 w-6 text-black cursor-pointer"
            onClick={closeCart}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 overflow-y-scroll max-h-[70vh]">
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {cart?.detalles?.map((item) => (
          <CartItem
            key={item.id_carrito_detalle}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
        {!loading && !cart?.detalles?.length && (
          <p className="text-center py-4">No hay productos en el carrito</p>
        )}
      </div>

      <div className="px-4 sm:px-6 py-4 mt-auto">
        <p className="flex justify-between items-center mb-2">
          <span className="font-light text-sm sm:text-base">Total:</span>
          <span className="font-medium text-lg sm:text-2xl">
            ${parseFloat(cartTotal).toFixed(2)}
          </span>
        </p>
        <button 
          className="bg-black py-2 sm:py-3 text-white w-full rounded-lg text-sm sm:text-base"
          disabled={!cart?.detalles?.length}
          onClick={() => {
            // Aquí iría la lógica para finalizar la compra
            console.log('Finalizar compra');
          }}
        >
          Finalizar Compra
        </button>
      </div>
    </aside>
  );
};

export default Cart;