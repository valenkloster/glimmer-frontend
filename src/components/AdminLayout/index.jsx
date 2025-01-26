import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, ChartBarIcon, ExclamationCircleIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/auth/AuthContext';


const AdminLayout = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
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
        <div className="flex h-screen bg-verde-agua">
            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
                     onClick={() => setSidebarOpen(false)} />
            )}
 
            {/* Sidebar */}
            <aside className={`
                fixed items-center lg:static w-64 h-full bg-nude p-4 z-30 flex flex-col
                transform transition-transform duration-200 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="mb-8">
                    <img src="/logo_glimmer.png" alt="Logo" className="h-12 mx-auto" />
                </div>
                <div className="mt-[30vh] flex-1">
                {menuItems.map(item => (
                    <Link 
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors
                        ${location.pathname === item.path 
                            ? 'bg-white text-verde-agua' 
                            : 'text-verde-agua hover:bg-nude-dark'}`}
                    >
                        {item.icon}
                        {item.title}
                    </Link>
                ))}
                </div>
                <button
                   onClick={handleLogout}
                   className="mt-auto p-3 w-full text-verde-agua hover:bg-nude-dark rounded-lg flex items-center gap-3"
                >
                   <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
                   Cerrar Sesión
                </button>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8 overflow-auto">
                <button className="lg:hidden mb-4" onClick={() => setSidebarOpen(true)}>
                    <Bars3Icon className="w-6 h-6" />
                </button>

                {location.pathname === '/admin' && (
                    <div className="flex h-full items-center justify-center px-4">
                        <div className="text-center max-w-2xl w-full">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                ¡Bienvenido al Panel de Administración!
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 mb-8">
                                Desde aquí podrás monitorear y optimizar la experiencia de compra de tus clientes.
                            </p>
                            <div className="bg-white/10 p-4 md:p-6 rounded-lg backdrop-blur-sm">
                                <p className="text-base md:text-lg text-white">
                                    "Haciendo que cada compra sea simple, rápida y satisfactoria para nuestros clientes."
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;