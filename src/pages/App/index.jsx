import { useRoutes, BrowserRouter, useLocation } from 'react-router-dom';
import { ShoppingCartProvider } from '../../context';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../hooks/ProtectedRoute';
import Home from '../Home';
import Shop from '../Shop';
import MyAccount from '../MyAccount';
import MyOrder from '../MyOrder';
import MyOrders from '../MyOrders';
import NotFound from '../NotFound';
import LoginPage from '../Auth/LoginPage';
import RegisterPage from '../Auth/RegisterPage';
import Navbar from '../../components/Navbar';
import CheckoutSideMenu from '../../components/CheckoutSideMenu';
import ProductPage from '../ProductPage';
import ForgotPassword from '../../components/ForgotPassword';
import ResetPassword from '../../components/ResetPassword';
import AboutUs from '../../components/AboutUs';

import './App.css';

const AppRoutes = () => {
  let routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/aboutUs', element: <AboutUs /> },
    { path: '/shop', element: <Shop /> },
    { 
      path: '/my-account', 
      element: (
        <ProtectedRoute>
          <MyAccount />
        </ProtectedRoute>
      ) 
    },
    { 
      path: '/my-order', 
      element: (
        <ProtectedRoute>
          <MyOrder />
        </ProtectedRoute>
      ) 
    },
    { 
      path: '/my-orders', 
      element: (
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      ) 
    },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/olvide-contrasena', element: <ForgotPassword /> },
    { path: '/cambio-de-contrasena', element: <ResetPassword /> },
    { path: '/products/:id', element: <ProductPage /> },
    { path: '/*', element: <NotFound /> }
  ]);

  return routes;
};

// Componente separado para el layout
const Layout = () => {
  const location = useLocation();
  const isAuthPage = [
    '/login', 
    '/register', 
    '/olvide-contrasena', 
    '/cambio-de-contrasena'
  ].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <AppRoutes />
      {!isAuthPage && <CheckoutSideMenu />}
    </>
  );
};

// Componente principal con providers
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShoppingCartProvider>
          <Layout />
        </ShoppingCartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;