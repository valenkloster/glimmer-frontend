import { useContext, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { CartContext } from '../../context/cart/CartContext';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
 const { updatingItems, setStockError } = useContext(CartContext);
 const { id_producto, cantidad, precio, producto } = item;

 const isUpdating = updatingItems.has(id_producto);
 const outOfStock = producto.stock <= 0;
 const isAtStockLimit = cantidad >= producto.stock;

 useEffect(() => {
   if (isAtStockLimit && producto.stock !== 0) {
     setStockError(`Lo sentimos, solo contamos con ${producto.stock} unidades disponibles para ${producto.nombre}.`);
   }
 }, [isAtStockLimit, producto.stock, setStockError]);

 if (!producto) return null;
 
 return (
   <div className={`
     flex items-start gap-4 my-3 w-full transition-opacity duration-200
     ${isUpdating ? 'opacity-50' : 'opacity-100'}
     ${outOfStock ? 'opacity-70' : ''}
   `}>
     <Link 
       to={`/products/${id_producto}`}
       className="w-20 h-20 flex-shrink-0"
     >
       <img 
         className="w-full h-full rounded-lg object-cover" 
         src={producto.imagen} 
         alt={producto.nombre} 
       />
     </Link>

     <div className="flex flex-col flex-grow">
       <Link 
         to={`/products/${id_producto}`}
         className="text-base font-medium break-words pr-2 hover:text-verde-agua transition-colors"
       >
         {producto.nombre}
       </Link>
       <p className="text-sm text-gray-500">
         {producto.marca}
       </p>
       <p className="text-base font-medium">
         ${parseFloat(precio).toFixed(2)}
       </p>
       {outOfStock && (
         <p className="text-red-500 text-sm">Producto no disponible</p>
       )}
     </div>

     <div className="flex items-center gap-2 flex-shrink-0">
       {!outOfStock ? (
         <>
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
             disabled={isAtStockLimit || isUpdating}
           >
             <PlusIcon className="h-3 w-3" />
           </button>
           <TrashIcon
             onClick={() => onRemove(id_producto)}
             className={`h-5 w-5 cursor-pointer ml-2 ${
               isUpdating ? 'text-gray-400' : 'text-red-600'
             }`}
           />
         </>
       ) : (
         <TrashIcon
           onClick={() => onRemove(id_producto)}
           className="h-5 w-5 cursor-pointer text-red-600"
         />
       )}
     </div>
   </div>
 );
};

export default CartItem;