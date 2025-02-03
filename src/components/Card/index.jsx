import { memo } from 'react'
import { CartButton } from '../CartButton'
import { FavoriteButton } from '../Favorite/FavoriteButton'
import { Link } from 'react-router-dom'

const Card = memo(({ data }) => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const {
    id_producto,
    stock,
    imagen,
    nombre,
    marca,
    precio
  } = data;

  const isOutOfStock = stock <= 0;
  const formattedPrice = parseFloat(precio).toLocaleString('es-AR');

  return (
    <div 
      className={`
        bg-white cursor-pointer rounded-lg hover:opacity-90 p-4
        w-full md:w-64 h-auto md:h-[420px]
        ${isOutOfStock ? 'opacity-70' : ''}
      `}
    >
      <figure className="relative mb-4 w-full h-48 md:h-72">
        <Link to={`/products/${id_producto}`} onClick={handleClick}>
          <div className="w-full h-full bg-gray-50 rounded-lg p-6">
            <img 
              className="w-full h-full object-contain" 
              src={imagen} 
              alt={nombre} 
              loading="lazy"
            />
          </div>
        </Link>
        <FavoriteButton productId={id_producto} />
        <CartButton product={data} />
      </figure>
      <Link to={`/products/${id_producto}`} onClick={handleClick}>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500 font-product">{marca}</p>
          <p className="text-base font-semibold font-product line-clamp-2">{nombre}</p>
          <p className="text-base font-serif font-bold mt-1">${formattedPrice}</p>
          {isOutOfStock && (
            <p className="text-red-500 text-sm">Producto no disponible</p>
          )}
        </div>
      </Link>
    </div>
  )
});

Card.displayName = 'Card';

export default Card;