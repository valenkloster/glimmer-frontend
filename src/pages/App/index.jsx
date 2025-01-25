import { BrowserRouter } from 'react-router-dom';
import { ShoppingCartProvider } from '../../context';
import { AuthProvider } from '../../context/auth/AuthContext';
import { FavoritesProvider } from '../../context/favorites/FavoritesContext';
import { CartProvider } from '../../context/cart/CartContext';
import { ReviewProvider } from '../../context/review/reviewContext';
import { AddressProvider } from '../../context/address/AddressContext';
import { OrderProvider } from '../../context/order/OrderContext';
import Layout from './Layout';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <OrderProvider>
        <CartProvider>
          <AddressProvider>
            <FavoritesProvider>
              <AuthProvider>
                <ShoppingCartProvider>
                  <ReviewProvider>
                    <Layout />
                  </ReviewProvider>
                </ShoppingCartProvider>
              </AuthProvider>
            </FavoritesProvider>
          </AddressProvider>
        </CartProvider>
      </OrderProvider>
    </BrowserRouter>
  );
};

export default App;