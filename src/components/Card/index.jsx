import { useContext } from 'react'
import { PlusIcon, CheckIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../context'

const Card = (data) => {
  const context = useContext(ShoppingCartContext)

  const showProduct = (productDetail) => {
    context.openProductDetail()
    context.setProductToShow(productDetail)
  }

  const addProductsToCart = (event, productData) => {
    event.stopPropagation()
    const productWithQuantity = { ...productData, quantity: 1 }; // AGREGUE ESTO
    context.setCartProducts([...context.cartProducts, productWithQuantity]);
    context.setCount(context.count + 1);
    context.openCheckoutSideMenu();
    context.closeProductDetail();
  }

  const renderIcon = (id) => {
    const isInCart = context.cartProducts.filter(product => product.id === id).length > 0

    if (isInCart) {
      return (
        <div
        className='absolute top-0 right-0 flex justify-center items-center bg-black w-6 h-6 rounded-full m-2 p-1'>
          <CheckIcon className='h-4 text-white'></CheckIcon>
        </div>
      )
    } else {
      return (
        <button
          className='absolute top-0 right-0 flex justify-center items-center bg-verde-agua text-white w-6 h-6 rounded-full m-2 p-1'
          onClick={(event) => addProductsToCart(event, data.data)}>
          <PlusIcon className='h-4 w-4 text-white'></PlusIcon>
        </button>
      )
    }
  }

  return (
    <div 
      className='bg-white cursor-pointer w-64 h-96 rounded-sm hover:opacity-80'
      onClick={() => showProduct(data.data)}>
      <figure className='relative mb-2 w-full h-2/3'>
        <img className='w-full h-full object-cover rounded-sm bg-nude' src={data.data.images[0]} alt={data.data.title} />
        {renderIcon(data.data.id)}
      </figure>
      <div className='my-3 h-1/3'>
        <hr className='pt-2 border-gray-400'></hr>
        <p className='text-base font-bold font-product py-1'>{data.data.title}</p>
        <p className='text-sm font-product text-gray-500 py-1'>{data.data.category.name}</p>
        <p className='text-base font-product font-bold'>${data.data.price}</p>
      </div>
    </div>
  )
  }
  
  export default Card