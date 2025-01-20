import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { ShoppingCartContext } from '../../context'

const Navbar = () => {
  const context = useContext(ShoppingCartContext)
  const activeStyle = 'underline underline-offset-4'

  return (
    <nav className='flex items-center justify-between mx-auto fixed z-10  top-0 w-full py-5 lg:px-8 text-sm font-light bg-nude font-product'>
      <ul className='flex items-center gap-3'>
        <li className='font-semibold text-lg'>
          <NavLink to='/'>
            <img src='/logo_glimmer.png' alt='Logo' className='w-24 h-auto' />
          </NavLink>
        </li>
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
      <ul className='flex items-center gap-3'>
        <li>
          <NavLink
            to='/my-orders'
            className={({ isActive }) =>
              isActive ? activeStyle : undefined
            }>
            My Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/my-account'
            className={({ isActive }) =>
              isActive ? activeStyle : undefined
            }>
            My Account
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/sing-in'
            className={({ isActive }) =>
              isActive ? activeStyle : undefined
            }>
            Sign In
          </NavLink>
        </li>
        <li className='flex items-center'>
          <ShoppingBagIcon className='h-6 w-6'></ShoppingBagIcon>
          <div>{context.count}</div>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar