import { useContext, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { CartContext } from '../../context/cart/CartContext';
import CartItem from '../CartItem';
import { useNavigate } from 'react-router-dom';
import StockModal from '../StockModal';

const Cart = () => {
 const navigate = useNavigate();
 const [showStockModal, setShowStockModal] = useState(false);
 const [stockIssues, setStockIssues] = useState([]);
 
 const { 
   cart,
   loading,
   error,
   isCartOpen,
   cartTotal,
   updateQuantity,
   removeFromCart,
   closeCart,
   checkStock,
   adjustCartQuantities
 } = useContext(CartContext);

 const validateAndCheckout = async () => {
  const updatedDetalles = await checkStock();
  
  const issues = updatedDetalles.filter(
    item => item.cantidad > item.producto.stock
  );

  if (issues.length > 0) {
    setStockIssues(issues);
    setShowStockModal(true);
    return;
  }

  proceedToCheckout();
};

const handleContinueWithAdjustments = async () => {
  await adjustCartQuantities(stockIssues);
  setShowStockModal(false);
  proceedToCheckout();
};

const proceedToCheckout = () => {
  closeCart();
  navigate('/checkout');
};

 if (!isCartOpen) return null;

 return (
   <aside className="fixed right-0 top-[81px] w-full max-w-[500px] h-[calc(100vh-81px)] border border-black rounded-lg bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 sm:p-6 border-b">
        <h2 className="font-medium text-lg sm:text-xl">Mi Carrito</h2>
        <XMarkIcon
          className="h-6 w-6 text-black cursor-pointer hover:text-gray-700"
          onClick={closeCart}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        )}
        {error && <p className="text-red-500 p-4 text-center">{error}</p>}
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

      <div className="px-4 sm:px-6 py-4 border-t bg-white">
        <p className="flex justify-between items-center mb-2">
          <span className="font-light text-sm sm:text-base">Total:</span>
          <span className="font-medium text-lg sm:text-2xl">
            ${parseFloat(cartTotal).toFixed(2)}
          </span>
        </p>
        <button 
          className={`w-full rounded-lg text-sm sm:text-base py-2 sm:py-3 transition-colors duration-200 ${!cart?.detalles?.length ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'}`}
          disabled={!cart?.detalles?.length}
          onClick={validateAndCheckout}
        >
          Finalizar Compra
        </button>
      </div>

      <StockModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        stockIssues={stockIssues}
        onContinue={handleContinueWithAdjustments}
      />
    </aside>
 );
};

export default Cart;