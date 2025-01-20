import { useContext } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ShoppingCartContext } from '../../context';
import OrderCard from '../OrderCard';
import { totalPrice } from '../../utils'
import './styles.css';

const CheckoutSideMenu = () => {
  const context = useContext(ShoppingCartContext);

  const handleDelete = (id) => {
    const filteredProducts = context.cartProducts.filter((product) => product.id !== id);
    context.setCartProducts(filteredProducts);
    context.setCount(context.count - 1);
  };

  const handleIncreaseQuantity = (id) => {
    const updatedProducts = context.cartProducts.map((product) => {
      if (product.id === id) {
        return { ...product, quantity: (product.quantity) + 1 };
      }
      return product;
    });
    context.setCartProducts(updatedProducts);
  };

  const handleDecreaseQuantity = (id) => {
    const updatedProducts = context.cartProducts.map((product) => {
      if (product.id === id) {
        return { ...product, quantity: product.quantity - 1 };
      }
      return product;
    });
    context.setCartProducts(updatedProducts);
  };

  const handleCheckout = () => {
    const orderToAdd = {
      date: DATE.NOW(),
      products: context.cartProducts,
      totalProducts: context.cartProducts.length,
      totalPrice: totalPrice(context.cartProducts)
    }

    context.setOrder([...context.order, orderToAdd])
    context.setCartProducts([])
  }

  return (
    <aside
      className={`${
        context.isCheckoutSideMenuOpen ? 'flex' : 'hidden'
      } checkout-side-menu flex-col fixed right-0 border border-black rounded-lg bg-white`}
    >
      <div className="flex justify-between items-center p-6">
        <h2 className="font-medium text-xl">Order Summary</h2>
        <div>
          <XMarkIcon
            className="h-6 w-6 text-black cursor-pointer"
            onClick={() => context.closeCheckoutSideMenu()}
          />
        </div>
      </div>
      <div className="px-6 overflow-y-scroll">
        {context.cartProducts.map((product) => (
          <OrderCard
            key={product.id}
            id={product.id}
            title={product.title}
            category={product.category.name}
            image={product.images[0]}
            price={product.price}
            quantity={product.quantity}
            onIncrease={() => handleIncreaseQuantity(product.id)}
            onDecrease={() => handleDecreaseQuantity(product.id)}
            handleDelete={handleDelete}
          />
        ))}
      </div>
      <div className="px-6 py-4 mt-auto">
        <p className='flex justify-between items-center mb-2'>
          <span className='font-light'>Total:</span>
          <span className='font-medium text-2xl'>${totalPrice(context.cartProducts).toFixed(2)}</span>
        </p>
        <button className='bg-black py-3 text-white w-full rounded-lg' onClick={() => handleCheckout()}>Checkout</button>
      </div>
    </aside>
  );
};

export default CheckoutSideMenu;
