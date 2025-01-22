import { useContext } from 'react'
import { CartButton } from '../CartButton'
import { FavoriteButton } from '../Favorite/FavoriteButton'
import { Link } from 'react-router-dom'
import './styles.css'

const Card = (data) => {
  return (
    <div className={`bg-white cursor-pointer w-64 h-[420px] rounded-lg hover:opacity-90 p-4 ${data.data.stock <= 0 ? 'opacity-70' : ''}`}>
      <figure className='relative mb-4 w-full h-72'>
        <Link to={`/products/${data.data.id_producto}`}>
          <div className='w-full h-full bg-gray-50 rounded-lg p-6'>
            <img 
              className='w-full h-full object-contain' 
              src={data.data.imagen} 
              alt={data.data.nombre} 
            />
          </div>
        </Link>
        <FavoriteButton productId={data.data.id_producto} />
        <CartButton product={data.data} />
      </figure>
      <Link to={`/products/${data.data.id_producto}`}>
        <div className='flex flex-col gap-1'>
          <p className='text-sm text-gray-500 font-product'>{data.data.marca}</p>
          <p className='text-base font-semibold font-product line-clamp-2'>{data.data.nombre}</p>
          <p className='text-base font-serif font-bold mt-1'>${data.data.precio}</p>
          {data.data.stock <= 0 && (
            <p className='text-red-500 text-sm'>Producto no disponible</p>
          )}
        </div>
      </Link>
    </div>
  )
}

export default Card;