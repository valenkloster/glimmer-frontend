import { TrashIcon } from '@heroicons/react/24/outline';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';

const OrderCard = ({ id, title, category, image, price, quantity, onIncrease, onDecrease, handleDelete }) => {
  return (
    <div className="flex justify-between items-center gap-2 mb-3">
      <div className="flex items-center gap-2">
        <figure className="w-20 h-20">
          <img className="w-full h-full rounded-lg object-cover" src={image} alt={title} />
        </figure>
        <div className="m-2 gap-2">
          <p className="text-base font-medium">{title}</p>
          <p className="text-sm text-gray-500">{category}</p>
          <p className="text-base font-medium">${(price * quantity).toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          className={`h-5 w-5 text-white bg-gray-500 rounded-full flex items-center justify-center ${
            quantity === 1 ? 'hidden' : ''
          }`}
        >
          <MinusIcon className="h-3 w-3" />
        </button>
        <span className="mx-2 text-lg font-medium">{quantity}</span>
        <button
          onClick={onIncrease}
          className="h-5 w-5 text-white bg-gray-500 rounded-full flex items-center justify-center"
        >
          <PlusIcon className="h-3 w-3" />
        </button>
        <TrashIcon
          onClick={() => handleDelete(id)}
          className="h-5 w-5 text-red-600 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default OrderCard;
