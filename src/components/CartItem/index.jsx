import { useContext } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { CartContext } from '../../context/cart/CartContext';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { updatingItems } = useContext(CartContext);
  const { id_producto, cantidad, precio, producto } = item;

  const isUpdating = updatingItems.has(id_producto);

  if (!producto) return null;

  return (
    <div className={`flex items-start gap-4 mb-3 w-full transition-opacity duration-200 ${
      isUpdating ? 'opacity-50' : 'opacity-100'
    }`}>
      <figure className="w-20 h-20 flex-shrink-0">
        <img 
          className="w-full h-full rounded-lg object-cover" 
          src={producto.imagen} 
          alt={producto.nombre} 
        />
      </figure>

      <div className="flex flex-col flex-grow">
        <p className="text-base font-medium break-words pr-2">
          {producto.nombre}
        </p>
        <p className="text-sm text-gray-500">
          {producto.marca}
        </p>
        <p className="text-base font-medium">
          ${parseFloat(precio).toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onUpdateQuantity(id_producto, cantidad - 1)}
          className={`h-5 w-5 text-white bg-gray-500 rounded-full flex items-center justify-center ${
            cantidad === 1 ? 'hidden' : ''
          }`}
          disabled={cantidad <= 1 || isUpdating}
        >
          <MinusIcon className="h-3 w-3" />
        </button>
        <span className="mx-2 text-lg font-medium w-4 text-center">
          {cantidad}
        </span>
        <button
          onClick={() => onUpdateQuantity(id_producto, cantidad + 1)}
          className="h-5 w-5 text-white bg-gray-500 rounded-full flex items-center justify-center"
          disabled={cantidad >= producto.stock || isUpdating}
        >
          <PlusIcon className="h-3 w-3" />
        </button>
        <TrashIcon
          onClick={() => onRemove(id_producto)}
          className={`h-5 w-5 cursor-pointer ml-2 ${
            isUpdating ? 'text-gray-400' : 'text-red-600'
          }`}
        />
      </div>
    </div>
  );
};

export default CartItem;