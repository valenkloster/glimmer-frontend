import { useContext } from 'react';
import { ShoppingCartContext } from '../../context';
import { HeartIcon } from '@heroicons/react/24/outline';

const ProductDetail = () => {
  const context = useContext(ShoppingCartContext);
  const { productToShow } = context;

  const addProductsToCart = (event, productData) => {
    event.stopPropagation()
    const productWithQuantity = { ...productData, quantity: 1 };
    context.setCartProducts([...context.cartProducts, productWithQuantity]);
    context.setCount(context.count + 1);
    context.openCheckoutSideMenu();
    context.closeProductDetail();
  }

  const renderIcon = (id) => {
    const isInCart = context.cartProducts.find(product => product.id === id) !== undefined

    if (isInCart) {
      return (
        <div className="p-3 m-2 border rounded-full bg-gray-400 opacity-60 text-black">
          Producto agregado
        </div>
      )
    } else {
      return (
        <button 
          className="p-3 m-2 border rounded-full hover:border-black"
          onClick={(event) => addProductsToCart(event, productToShow)}>
          Agregar al carrito
        </button>
)
    }
  }

  return (
    <section className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-20 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center rounded-lg">
            <img 
              src={productToShow?.images?.[0]} 
              alt={productToShow?.title} 
              loading="lazy"
            />
          </div>
          <div className="flex flex-col my-8 space-y-2">
              <p className="text-sm text-gray-500">
                  Ordinary
              </p>
              <p className="text-2xl font-bold text-gray-900 font-product">
                {productToShow?.title}
              </p>
              <p className="text-xs text-gray-600">
                Item 2580405
              </p>
              <p className="text-xl font-semibold font-serif">
                ${productToShow?.price}
              </p>
              <p className="text-sm text-gray-600">
                  Size: 1.0 oz
              </p>
              <hr />
              <h3 className='text-xl text-bold font-serif'>Resumen</h3>
              <p className="text-gray-600 font-serif">
                  {productToShow?.description}
              </p>
              <div className='flex items-center justify-around mx-20'>
                {renderIcon(productToShow?.id)}
                <button 
                  className="p-3 border rounded-full hover:border-black">
                  <HeartIcon className='h-6 w-6'></HeartIcon>
                </button>
              </div>
          </div>
          </div>
        </div>
    </section>
  );
};

export default ProductDetail;