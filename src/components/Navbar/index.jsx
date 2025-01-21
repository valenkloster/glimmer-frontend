import { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon,
  UserCircleIcon,
  HeartIcon,
  ShoppingCartIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { ShoppingCartContext } from '../../context';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const context = useContext(ShoppingCartContext);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const activeStyle = 'underline underline-offset-4';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Refs para los elementos del menú
  const shopMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const navRef = useRef(null);

  // Función para manejar clics fuera de los menús
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

  // Obtener solo las categorías padre
  const parentCategories = context.categories?.filter(cat => !cat.id_categoria_padre) || [];

  const handleCategoryClick = (categoryId, e) => {
    e.preventDefault();
    context.setSelectedCategory(categoryId);
    setIsShopMenuOpen(false);
    setIsMenuOpen(false);
    navigate(`/shop?category=${categoryId}`);
  };

  const handleLogout = () => {
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
            <p className="text-sm font-medium text-gray-700">{user?.nombre || 'Usuario'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <NavLink
            to="/my-account"
            onClick={() => setIsUserMenuOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <UserCircleIcon className="h-5 w-5" />
            Mi Cuenta
          </NavLink>
          <NavLink
            to="/my-orders"
            onClick={() => setIsUserMenuOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Mis Pedidos
          </NavLink>
          <NavLink
            to="/favorites"
            onClick={() => setIsUserMenuOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <HeartIcon className="h-5 w-5" />
            Favoritos
          </NavLink>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            onClick={() => setIsUserMenuOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Iniciar Sesión
          </NavLink>
          <NavLink
            to="/register"
            onClick={() => setIsUserMenuOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Registrarse
          </NavLink>
        </>
      )}
    </div>
  );

  return (
    <nav ref={navRef} className='flex items-center fixed z-10 top-0 w-full py-5 px-5 text-sm font-light bg-nude font-product'>
      <div className='flex items-center justify-between w-full'>
        {/* Left section - Logo */}
        <div className='flex items-center'>
          <NavLink to='/'>
            <img src='/logo_glimmer.png' alt='Logo' className='w-24 h-auto' />
          </NavLink>
        </div>

        {/* Center section - Navigation links */}
        <div className='hidden md:flex items-center justify-center flex-1'>
          <ul className='flex gap-6'>
            <li>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }>
                INICIO
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/about us'
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }>
                SOBRE NOSOTROS
              </NavLink>
            </li>
            <li className="relative">
              <NavLink
                to='/shop'
                className={({ isActive }) =>
                  `${isActive ? activeStyle : ''} relative`
                }
                onMouseEnter={() => setIsShopMenuOpen(true)}
                onClick={(e) => {
                  e.preventDefault();
                  context.setSelectedCategory(null);
                  setIsShopMenuOpen(!isShopMenuOpen);
                  navigate('/shop');
                }}>
                TIENDA
              </NavLink>
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
                      <NavLink
                        to={`/shop?category=${parentCat.id_categoria}`}
                        onClick={(e) => handleCategoryClick(parentCat.id_categoria, e)}
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        {parentCat.nombre}
                      </NavLink>
                      
                      <div className="absolute left-full top-0 w-48 bg-white shadow-lg rounded-md py-2 hidden group-hover:block">
                        {parentCat.subcategorias?.map(childCat => (
                          <NavLink
                            key={childCat.id_categoria}
                            to={`/shop?category=${childCat.id_categoria}`}
                            onClick={(e) => handleCategoryClick(childCat.id_categoria, e)}
                            className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                          >
                            {childCat.nombre}
                          </NavLink>
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
        <div className='flex items-center gap-4'>
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
            onClick={() => context.openCheckoutSideMenu()}
          >
            <ShoppingBagIcon className='h-6 w-6' />
            <div>{context.count}</div>
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
          <ul className='flex flex-col items-start p-4 gap-4'>
            <li>
              <NavLink
                to='/'
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }>
                INICIO
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/about us'
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }>
                SOBRE NOSOTROS
              </NavLink>
            </li>
            <li className="w-full">
              <NavLink
                to='/shop'
                onClick={(e) => {
                  e.preventDefault();
                  context.setSelectedCategory(null);
                  setIsMenuOpen(false);
                  window.history.pushState({}, '', '/shop');
                }}
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }>
                TIENDA
              </NavLink>
              <div className="pl-4 mt-2">
                {parentCategories.map(parentCat => (
                  <div key={parentCat.id_categoria}>
                    <NavLink
                      to={`/shop?category=${parentCat.id_categoria}`}
                      onClick={(e) => handleCategoryClick(parentCat.id_categoria, e)}
                      className="block py-2"
                    >
                      {parentCat.nombre}
                    </NavLink>
                    <div className="pl-4">
                      {parentCat.subcategorias?.map(childCat => (
                        <NavLink
                          key={childCat.id_categoria}
                          to={`/shop?category=${childCat.id_categoria}`}
                          onClick={(e) => handleCategoryClick(childCat.id_categoria, e)}
                          className="block py-2"
                        >
                          {childCat.nombre}
                        </NavLink>
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