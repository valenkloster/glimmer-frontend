import { useContext } from 'react'
import { PlusIcon, CheckIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../context'
import { Link } from 'react-router-dom'
import './styles.css'

const Card = (data) => {
  const context = useContext(ShoppingCartContext)

  const addProductsToCart = (event, productData) => {
    event.stopPropagation()
    const productWithQuantity = { ...productData, quantity: 1 }
    context.setCartProducts([...context.cartProducts, productWithQuantity])
    context.setCount(context.count + 1)
    context.openCheckoutSideMenu()
    context.closeProductDetail()
  }

  const renderIcon = (id) => {
    const isInCart = context.cartProducts.filter(product => product.id === id).length > 0

    if (isInCart) {
      return (
        <div
          className='absolute top-0 right-0 flex justify-center items-center bg-black w-6 h-6 rounded-full m-4 p-1'>
          <CheckIcon className='h-4 text-white'></CheckIcon>
        </div>
      )
    } else {
      return (
        <button
          className='absolute top-0 right-0 flex justify-center items-center bg-verde-agua text-white w-6 h-6 rounded-full m-4 p-1'
          onClick={(event) => addProductsToCart(event, data.data)}>
          <PlusIcon className='h-4 w-4 text-white'></PlusIcon>
        </button>
      )
    }
  }

  return (
    <div className='bg-white cursor-pointer w-64 h-[420px] rounded-lg hover:opacity-90 p-4'>
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
        {renderIcon(data.data.id_producto)}
      </figure>
      <Link to={`/products/${data.data.id_producto}`}>
        <div className='flex flex-col gap-1'>
          <p className='text-sm text-gray-500 font-product'>{data.data.marca}</p>
          <p className='text-base font-semibold font-product line-clamp-2'>{data.data.nombre}</p>
          <p className='text-base font-serif font-bold mt-1'>${data.data.precio}</p>
        </div>
      </Link>
    </div>
  )
}

export default Card