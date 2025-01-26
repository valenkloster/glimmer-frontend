import { useRoutes } from 'react-router-dom';
import ProtectedRoute from '../../hooks/ProtectedRoute';
import Home from '../Home';
import Shop from '../Shop';
import FavoritesPage from '../Favorites';
import MyOrders from '../MyOrders';
import NotFound from '../NotFound';
import LoginPage from '../Auth/LoginPage';
import RegisterPage from '../Auth/RegisterPage';
import SuccessPage from '../Success';
import FailurePage from '../Failure';
import CheckoutPage from '../Checkout';
import ProductPage from '../ProductPage';
import ForgotPassword from '../../components/ForgotPassword';
import ResetPassword from '../../components/ResetPassword';
import AboutUs from '../../components/AboutUs';
import OrderDetail from '../../components/OrderDetail';
import AdminLayout from '../../components/AdminLayout';
import SalesStats from '../../components/SalesStats';

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/aboutUs', element: <AboutUs /> },
    { path: '/shop', element: <Shop /> },
    { path: '/favorites', element: <FavoritesPage /> },
    { path: '/my-orders', element: <ProtectedRoute><MyOrders /></ProtectedRoute> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/olvide-contrasena', element: <ForgotPassword /> },
    { path: '/cambio-de-contrasena', element: <ResetPassword /> },
    { path: '/products/:id', element: <ProductPage /> },
    { path: '/my-orders/:id', element: <ProtectedRoute><OrderDetail /></ProtectedRoute> },
    { path: '/success', element: <SuccessPage /> },
    { path: '/failure', element: <FailurePage /> },
    { path: '/checkout', element: <CheckoutPage /> },
    { path: '/*', element: <NotFound /> },
    // Rutas de administrador
    { 
      path: '/admin', 
      element: <ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>,
      children: [
        { path: 'ventas', element: <SalesStats /> },
        // { path: 'productos', element: <TopProducts /> },
        // { path: 'stock', element: <StockControl /> },
        // { path: '', element: <Navigate to="/admin/ventas" replace /> }
      ]
    },
  ]);

  return routes;
};

export default AppRoutes;