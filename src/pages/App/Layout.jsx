import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Cart from '../../components/Cart';
import Footer from '../../components/Footer';
import AppRoutes from './routes';

const Layout = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/olvide-contrasena', '/cambio-de-contrasena'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAuthPage || isAdminPage) {
    return <AppRoutes />;
  }

  return (
    <>
      <header className="h-[81px] fixed w-full z-50 bg-white">
        <Navbar />
      </header>
      
      <main>
        <AppRoutes />
        <Cart />
      </main>

      <Footer />
    </>
  );
};

export default Layout;