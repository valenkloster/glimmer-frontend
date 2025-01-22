import { useContext, useState } from 'react';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/solid';
import { CartContext } from '../../context/cart/CartContext';
import { AuthContext } from '../../context/auth/AuthContext';
import { LoginAlert } from '../LoginAlert';

export const CartButton = ({ product }) => {
  const { addToCart, cart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);

  const isInCart = cart?.detalles?.some(item => 
    item.id_producto === product.id_producto
  );

  const handleClick = (event) => {
    event.stopPropagation();

    if (!isAuthenticated) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    addToCart(product.id_producto, 1);
  };

  if (product.stock <= 0) {
    return (
      <div className='absolute top-0 right-0 flex justify-center items-center bg-red-500 w-auto px-2 h-6 rounded-full m-4'>
        <span className='text-white text-xs'>Sin stock</span>
      </div>
    );
  }

  if (isInCart) {
    return (
      <div className='absolute top-0 right-0 flex justify-center items-center bg-black w-6 h-6 rounded-full m-4 p-1'>
        <CheckIcon className='h-4 text-white' />
      </div>
    );
  }

  return (
    <>
      <button
        disabled={product.stock <= 0}
        className='absolute top-0 right-0 flex justify-center items-center bg-verde-agua text-white w-6 h-6 rounded-full m-4 p-1 disabled:bg-gray-400'
        onClick={handleClick}
      >
        <PlusIcon className='h-4 w-4 text-white' />
      </button>
      {showAlert && <LoginAlert text="agregar productos al carrito" />}
    </>
  );
};