import { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ShoppingBagIcon, Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import { ShoppingCartContext } from '../../context'

const Navbar = () => {
  const context = useContext(ShoppingCartContext)
  const activeStyle = 'underline underline-offset-4'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Obtener solo las categorías padre
  const parentCategories = context.categories?.filter(cat => !cat.id_categoria_padre) || []

  const handleCategoryClick = (categoryId, e) => {
    e.preventDefault(); // Prevenir la navegación predeterminada
    context.setSelectedCategory(categoryId);
    setIsShopMenuOpen(false);
    setIsMenuOpen(false);
    window.history.pushState({}, '', `/shop?category=${categoryId}`);
  }

  return (
    <nav className='flex items-center fixed z-10 top-0 w-full py-5 px-5 text-sm font-light bg-nude font-product'>
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
                  setIsShopMenuOpen(false);
                  window.history.pushState({}, '', '/shop');
                }}>
                TIENDA
              </NavLink>
              {/* Desktop dropdown menu */}
              {isShopMenuOpen && (
                <div 
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
                        {parentCat.subcategorias.map(childCat => (
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
          <NavLink
            to='/my-account'
            className={({ isActive }) =>
              isActive ? activeStyle : undefined
            }>
            <UserIcon className='h-6 w-6' />
          </NavLink>
          <div className='flex items-center'>
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
                      {parentCat.subcategorias.map(childCat => (
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
  )
}

export default Navbar