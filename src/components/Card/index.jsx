import { useContext } from 'react'
import { PlusIcon, CheckIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../context'
import { FavoriteButton } from '../Favorite/FavoriteButton'
import { Link } from 'react-router-dom'
import './styles.css'

const Card = (data) => {
  const context = useContext(ShoppingCartContext)
  const outOfStock = data.data.stock <= 0

  const renderIcon = (id) => {
    const isInCart = context.cartProducts.filter(product => product.id_producto === id).length > 0

    if (outOfStock) {
      return (
        <div className='absolute top-0 right-0 flex justify-center items-center bg-red-500 w-auto px-2 h-6 rounded-full m-4'>
          <span className='text-white text-xs'>Sin stock</span>
        </div>
      )
    }

    if (isInCart) {
      return (
        <div className='absolute top-0 right-0 flex justify-center items-center bg-black w-6 h-6 rounded-full m-4 p-1'>
          <CheckIcon className='h-4 text-white'></CheckIcon>
        </div>
      )
    }

    return (
      <button
        disabled={outOfStock}
        className='absolute top-0 right-0 flex justify-center items-center bg-verde-agua text-white w-6 h-6 rounded-full m-4 p-1 disabled:bg-gray-400'
        onClick={(event) => context.addProductToCart(event, data.data)}>
        <PlusIcon className='h-4 w-4 text-white'></PlusIcon>
      </button>
    )
  }

  return (
    <div className={`bg-white cursor-pointer w-64 h-[420px] rounded-lg hover:opacity-90 p-4 ${outOfStock ? 'opacity-70' : ''}`}>
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
        {renderIcon(data.data.id_producto)}
      </figure>
      <Link to={`/products/${data.data.id_producto}`}>
        <div className='flex flex-col gap-1'>
          <p className='text-sm text-gray-500 font-product'>{data.data.marca}</p>
          <p className='text-base font-semibold font-product line-clamp-2'>{data.data.nombre}</p>
          <p className='text-base font-serif font-bold mt-1'>${data.data.precio}</p>
          {outOfStock && (
            <p className='text-red-500 text-sm'>Producto no disponible</p>
          )}
        </div>
      </Link>
    </div>
  )
}

export default Card