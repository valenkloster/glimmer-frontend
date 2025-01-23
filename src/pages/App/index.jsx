import { useRoutes, BrowserRouter, useLocation } from 'react-router-dom';
import { ShoppingCartProvider } from '../../context';
import { AuthProvider } from '../../context/auth/AuthContext';
import { FavoritesProvider } from '../../context/favorites/FavoritesContext';
import { CartProvider } from '../../context/cart/CartContext';
import { ReviewProvider } from '../../context/review/reviewContext';
import ProtectedRoute from '../../hooks/ProtectedRoute';
import Home from '../Home';
import Shop from '../Shop';
import FavoritesPage from '../Favorites';
import MyOrder from '../MyOrder';
import MyOrders from '../MyOrders';
import NotFound from '../NotFound';
import LoginPage from '../Auth/LoginPage';
import RegisterPage from '../Auth/RegisterPage';
import Navbar from '../../components/Navbar';
import Cart from '../../components/Cart';
import ProductPage from '../ProductPage';
import ForgotPassword from '../../components/ForgotPassword';
import ResetPassword from '../../components/ResetPassword';
import AboutUs from '../../components/AboutUs';
import Footer from '../../components/Footer';

import './App.css';

const AppRoutes = () => {
  let routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/aboutUs', element: <AboutUs /> },
    { path: '/shop', element: <Shop /> },
    { path: '/favorites', element: <FavoritesPage /> },
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
      {!isAuthPage && <Cart />}
      {!isAuthPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          <AuthProvider>
            <ShoppingCartProvider>
              <ReviewProvider>
                <Layout />
              </ReviewProvider>
            </ShoppingCartProvider>
          </AuthProvider>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;