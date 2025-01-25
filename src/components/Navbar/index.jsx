import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon,
  HeartIcon,
  ShoppingCartIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { ShoppingCartContext } from '../../context';
import { CartContext } from '../../context/cart/CartContext';
import { useAuth } from '../../context/auth/AuthContext';
import { accountService } from '../../services/accountService';
import SearchBar from '../SearchBar';

const Navbar = () => {
  const context = useContext(ShoppingCartContext);
  const { cartCount, openCart } = useContext(CartContext);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeStyle = 'underline underline-offset-4';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [clientName, setClientName] = useState('');

  const shopMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const navRef = useRef(null);

  // Cargar el nombre del cliente
  useEffect(() => {
    const loadClientName = async () => {
      if (isAuthenticated && user?.id_user) {
        try {
          const response = await accountService.getClientInfo();
          if (response.body) {
            setClientName(`${response.body.nombre} ${response.body.apellido}`);
          }
        } catch (err) {
          console.error('Error loading client info:', err);
        }
      }
    };
    loadClientName();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shopMenuRef.current && 
        !shopMenuRef.current.contains(event.target) &&
        !navRef.current.contains(event.target)
      ) {
        setIsShopMenuOpen(false);
      }
      if (
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const parentCategories = context.categories?.filter(cat => !cat.id_categoria_padre) || [];

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  const handleCategoryClick = (categoryId, e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    context.setSelectedCategory(categoryId);
    setIsShopMenuOpen(false);
    setIsMenuOpen(false);
    navigate(`/shop?category=${categoryId}`);
  };

  const handleLogout = () => {
    window.scrollTo(0, 0);
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const UserMenu = () => (
    <div 
      ref={userMenuRef}
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
    >
      {isAuthenticated ? (
        <>
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700">{clientName || 'Usuario'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setIsUserMenuOpen(false);
              navigate('/my-orders');
            }}
            className="inline-flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Mis Pedidos
          </button>
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setIsUserMenuOpen(false);
              navigate('/favorites');
            }}
            className="inline-flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
          >
            <HeartIcon className="h-5 w-5" />
            Favoritos
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 gap-2"
          >
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setIsUserMenuOpen(false);
              navigate('/login');
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setIsUserMenuOpen(false);
              navigate('/register');
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
          >
            Registrarse
          </button>
        </>
      )}
    </div>
  );

  return (
    <nav ref={navRef} className='flex items-center fixed z-10 top-0 w-full py-5 px-5 text-sm font-light bg-nude font-product'>
      <div className='flex items-center justify-between w-full'>
        {/* Left section - Logo */}
        <div className='flex items-center'>
          <button onClick={() => handleNavigation('/')}>
            <img src='/logo_glimmer.png' alt='Logo' className='w-24 h-auto' />
          </button>
        </div>

        {/* Center section - Navigation links */}
        <div className='hidden md:flex items-center justify-center flex-1'>
          <ul className='flex gap-6'>
            <li>
              <button
                onClick={() => handleNavigation('/')}
                className={location.pathname === '/' ? activeStyle : undefined}
              >
                INICIO
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/aboutUs')}
                className={location.pathname === '/aboutUs' ? activeStyle : undefined}
              >
                SOBRE NOSOTROS
              </button>
            </li>
            <li className="relative">
              <button
                className={`${location.pathname === '/shop' ? activeStyle : ''} relative`}
                onMouseEnter={() => setIsShopMenuOpen(true)}
                onClick={(e) => {
                  context.clearSearch()
                  e.preventDefault();
                  window.scrollTo(0, 0);
                  context.setSelectedCategory(null);
                  setIsShopMenuOpen(!isShopMenuOpen);
                  navigate('/shop');
                }}
              >
                PRODUCTOS
              </button>
              {/* Desktop dropdown menu */}
              {isShopMenuOpen && (
                <div 
                  ref={shopMenuRef}
                  className="absolute left-0 mt-1 w-48 bg-white shadow-lg rounded-md py-2 z-50"
                  onMouseEnter={() => setIsShopMenuOpen(true)}
                  onMouseLeave={() => setIsShopMenuOpen(false)}
                >
                  {parentCategories.map(parentCat => (
                    <div key={parentCat.id_categoria} className="relative group">
                      <button
                        onClick={(e) => handleCategoryClick(parentCat.id_categoria, e)}
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        {parentCat.nombre}
                      </button>
                      
                      <div className="absolute left-full top-0 w-48 bg-white shadow-lg rounded-md py-2 hidden group-hover:block">
                        {parentCat.subcategorias?.map(childCat => (
                          <button
                            key={childCat.id_categoria}
                            onClick={(e) => handleCategoryClick(childCat.id_categoria, e)}
                            className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                          >
                            {childCat.nombre}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* Right section - Icons and menu button */}
        <div className="flex items-center gap-4">
          <SearchBar />
          <div className="relative">
            <button
              className="flex items-center focus:outline-none"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <UserIcon className="h-6 w-6" />
            </button>
            {isUserMenuOpen && <UserMenu />}
          </div>
          <div 
            className='flex items-center cursor-pointer'
            onClick={openCart}
          >
            <ShoppingBagIcon className='h-6 w-6' />
            <div>{cartCount}</div>
          </div>
          <button 
            className='md:hidden'
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <XMarkIcon className='h-6 w-6' />
            ) : (
              <Bars3Icon className='h-6 w-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='absolute top-full left-0 w-full bg-nude md:hidden max-h-[calc(100vh-5rem)] overflow-y-auto'>
          <div className="p-4">
            <SearchBar />
          </div>
          <ul className='flex flex-col items-start p-4 gap-4'>
            <li>
              <button
                onClick={() => {
                  handleNavigation('/');
                  setIsMenuOpen(false);
                }}
                className={location.pathname === '/' ? activeStyle : undefined}
              >
                INICIO
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handleNavigation('/aboutUs');
                  setIsMenuOpen(false);
                }}
                className={location.pathname === '/aboutUs' ? activeStyle : undefined}
              >
                SOBRE NOSOTROS
              </button>
            </li>
            <li className="w-full">
              <button
                onClick={() => {
                  context.clearSearch()
                  window.scrollTo(0, 0);
                  context.setSelectedCategory(null);
                  setIsMenuOpen(false);
                  navigate('/shop');
                }}
                className={location.pathname === '/shop' ? activeStyle : undefined}
              >
                PRODUCTOS
              </button>
              <div className="pl-4 mt-2">
                {parentCategories.map(parentCat => (
                  <div key={parentCat.id_categoria}>
                    <button
                      onClick={(e) => handleCategoryClick(parentCat.id_categoria, e)}
                      className="block py-2"
                    >
                      {parentCat.nombre}
                    </button>
                    <div className="pl-4">
                      {parentCat.subcategorias?.map(childCat => (
                        <button
                          key={childCat.id_categoria}
                          onClick={(e) => handleCategoryClick(childCat.id_categoria, e)}
                          className="block py-2"
                        >
                          {childCat.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;