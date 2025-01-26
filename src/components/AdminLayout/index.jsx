import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, ChartBarIcon, ExclamationCircleIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/auth/AuthContext';

const AdminLayout = () => {
   const { logout } = useAuth();
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const location = useLocation();
   const navigate = useNavigate();
   
   const menuItems = [
       { title: "KPIs", path: "/admin/ventas", icon: <ChartBarIcon className="w-6 h-6" /> },
       { title: "Top Productos", path: "/admin/productos", icon: <Bars3Icon className="w-6 h-6" /> },
       { title: "Control Stock", path: "/admin/stock", icon: <ExclamationCircleIcon className="w-6 h-6" /> }
   ];

   const handleLogout = () => {
       window.scrollTo(0, 0);
       logout();
       setSidebarOpen(false);
       navigate('/login');
   };

   return (
       <div className="flex h-screen w-full bg-nude overflow-hidden">
           {sidebarOpen && (
               <div className="fixed inset-0 bg-black bg-opacity-50 z-20" 
                    onClick={() => setSidebarOpen(false)} />
           )}

           <aside className={`
               fixed items-center lg:static w-64 h-full bg-verde-agua/90 p-4 z-30 flex flex-col
               transform transition-transform duration-200 ease-in-out
               ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
           `}>
               <div className="flex-1 flex flex-col justify-center">
                   {menuItems.map(item => (
                       <Link 
                           key={item.path}
                           to={item.path}
                           className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors
                           ${location.pathname === item.path 
                               ? 'bg-nude/30 text-nude' 
                               : 'text-nude hover:bg-nude-dark'}`}
                       >
                           {item.icon}
                           {item.title}
                       </Link>
                   ))}
               </div>
               <button
                  onClick={handleLogout}
                  className="mt-auto p-3 w-full text-white hover:bg-nude-dark rounded-lg flex justify-center items-center gap-3"
               >
                  <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
                  Cerrar Sesión
               </button>
           </aside>

           <div className="flex-1 flex flex-col w-full h-full">
               <header className="p-4 flex justify-between items-center">
                   <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                       <Bars3Icon className="w-6 h-6" />
                   </button>
                   <div className="flex-1 flex justify-center">
                       <img src="/logo_glimmer.png" alt="Logo" className="h-16" />
                   </div>
               </header>

               <main className="flex-1 p-8 overflow-auto">
                   {location.pathname === '/admin' && (
                       <div className="flex h-full items-center justify-center px-4">
                           <div className="text-center max-w-2xl w-full">
                               <h1 className="text-4xl md:text-5xl font-bold text-verde-agua mb-4">
                                   ¡Bienvenido al Panel de Administración!
                               </h1>
                               <p className="text-lg md:text-xl text-gray-600 mb-8">
                                   Desde aquí podrás monitorear y optimizar la experiencia de compra de tus clientes.
                               </p>
                           </div>
                       </div>
                   )}
                   <Outlet />
               </main>
           </div>
       </div>
   );
};

export default AdminLayout;