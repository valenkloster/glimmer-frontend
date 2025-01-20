import { useRoutes, BrowserRouter } from 'react-router-dom';
import { ShoppingCartProvider } from '../../context';
import Home from '../Home';
import Shop from '../Shop';
import MyAccount from '../MyAccount';
import MyOrder from '../MyOrder';
import MyOrders from '../MyOrders';
import NotFound from '../NotFound';
import SingIn from '../SingIn';
import Navbar from '../../components/Navbar';
import CheckoutSideMenu from '../../components/CheckoutSideMenu';
import ProductPage from '../../pages/ProductPage';

import './App.css';

const AppRoutes = () => {
  let routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/shop', element: <Shop /> },
    { path: '/my-account', element: <MyAccount /> },
    { path: '/my-order', element: <MyOrder /> },
    { path: '/my-orders', element: <MyOrders /> },
    { path: '/*', element: <NotFound /> },
    { path: '/sing-in', element: <SingIn /> },
    { path: '/products/:id', element: <ProductPage /> }
  ]);

  return routes;
};

const AppContent = () => {
  return (
    <>
      <Navbar />
      <AppRoutes />
      <CheckoutSideMenu />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ShoppingCartProvider>
        <AppContent />
      </ShoppingCartProvider>
    </BrowserRouter>
  );
};

export default App;