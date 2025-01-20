import { TrashIcon } from '@heroicons/react/24/outline';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';

const OrderCard = ({ id_producto, nombre, imagen, precio, quantity, onIncrease, onDecrease, handleDelete }) => {
  return (
    <div className="flex items-start gap-4 mb-3 w-full">
      {/* Imagen del producto */}
      <figure className="w-20 h-20 flex-shrink-0">
        <img className="w-full h-full rounded-lg object-cover" src={imagen} alt={nombre} />
      </figure>

      {/* Información del producto */}
      <div className="flex flex-col flex-grow">
        <p className="text-base font-medium break-words pr-2">{nombre}</p>
        <p className="text-base font-medium">${parseFloat(precio).toFixed(2)}</p>
      </div>

      {/* Controles de cantidad y eliminar */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onDecrease}
          className={`h-5 w-5 text-white bg-gray-500 rounded-full flex items-center justify-center ${
            quantity === 1 ? 'hidden' : ''
          }`}
        >
          <MinusIcon className="h-3 w-3" />
        </button>
        <span className="mx-2 text-lg font-medium w-4 text-center">{quantity}</span>
        <button
          onClick={onIncrease}
          className="h-5 w-5 text-white bg-gray-500 rounded-full flex items-center justify-center"
        >
          <PlusIcon className="h-3 w-3" />
        </button>
        <TrashIcon
          onClick={() => handleDelete(id_producto)}
          className="h-5 w-5 text-red-600 cursor-pointer ml-2"
        />
      </div>
    </div>
  );
};

export default OrderCard;