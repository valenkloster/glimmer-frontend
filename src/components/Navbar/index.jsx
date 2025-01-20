import { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ShoppingBagIcon, Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import { ShoppingCartContext } from '../../context'

const Navbar = () => {
  const context = useContext(ShoppingCartContext)
  const activeStyle = 'underline underline-offset-4'
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
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
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/about us'
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }>
                ABOUT US
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/shop'
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }>
                SHOP
              </NavLink>
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
        <div className='absolute top-full left-0 w-full bg-nude md:hidden'>
          <ul className='flex flex-col items-start p-4 gap-4'>
            <li>
              <NavLink
                to='/'
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }>
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/about us'
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }>
                ABOUT US
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/shop'
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }>
                SHOP
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar