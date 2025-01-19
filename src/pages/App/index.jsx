import { useRoutes, BrowserRouter} from 'react-router-dom'
import { ShoppingCartProvider } from '../../context'
import Home from '../Home'
import MyAccount from '../MyAccount'
import MyOrder from '../MyOrder'
import MyOrders from '../MyOrders'
import NotFound from '../NotFound'
import SingIn from '../SingIn'
import Navbar from '../../components/Navbar'
import CheckoutSideMenu from '../../components/CheckoutSideMenu'

import './App.css'

const AppRoutes = () => {
  let routes = useRoutes ([
    { path: '/', element: <Home /> },
    { path: '/my-account', element: <MyAccount /> },
    { path: '/my-order', element: <MyOrder /> },
    { path: '/my-orders', element: <MyOrders /> },
    { path: '/*', element: <NotFound /> },
    { path: '/sing-in', element: <SingIn /> },
  ])

  return routes
}
const App = () => {
  return (
    <ShoppingCartProvider>
      <BrowserRouter>
        <AppRoutes />
        <Navbar />
        <CheckoutSideMenu />
    </BrowserRouter>
    </ShoppingCartProvider>
  )
}

export default App
