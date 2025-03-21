import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { OrderContext } from '../../context/order/OrderContext';
import { Link } from 'react-router-dom';
import { 
    CalendarIcon, 
    FunnelIcon, 
    AdjustmentsHorizontalIcon, 
    XMarkIcon,
    ChevronDownIcon 
} from '@heroicons/react/24/outline';

const OrderList = () => {
    const { orders, loading, error } = useContext(OrderContext);
    const [filters, setFilters] = useState({
        status: '',
        dateRange: '',
        minAmount: '',
        maxAmount: ''
    });
    const [isAmountFilterOpen, setIsAmountFilterOpen] = useState(false);
    const amountFilterRef = useRef(null);
    const minAmountRef = useRef(null);
    const maxAmountRef = useRef(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (amountFilterRef.current && !amountFilterRef.current.contains(event.target)) {
                setIsAmountFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (minAmountRef.current) minAmountRef.current.value = filters.minAmount;
        if (maxAmountRef.current) maxAmountRef.current.value = filters.maxAmount;
    }, [filters]);

    const uniqueStatuses = useMemo(() => {
        if (!orders) return [];
        return [...new Set(orders.map(order => order.estado.descripcion))];
    }, [orders]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name !== 'minAmount' && name !== 'maxAmount') {
            setFilters(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAmountKeyDown = (type) => (e) => {
        if (e.key === 'Enter') {
            const value = e.target.value;
            setFilters(prev => ({
                ...prev,
                [type]: value
            }));
            e.target.blur();
        }
    };

    const handleClearFilters = () => {
        setFilters({
            status: '',
            dateRange: '',
            minAmount: '',
            maxAmount: ''
        });
        if (minAmountRef.current) minAmountRef.current.value = '';
        if (maxAmountRef.current) maxAmountRef.current.value = '';
    };

    const filteredOrders = useMemo(() => {
        if (!orders) return [];
        
        return orders.filter(order => {
            if (filters.status && order.estado.descripcion !== filters.status) {
                return false;
            }
            
            if (filters.dateRange) {
                const orderDate = new Date(order.fecha);
                const today = new Date();
                
                switch (filters.dateRange) {
                    case 'last7days':
                        const last7Days = new Date(today.setDate(today.getDate() - 7));
                        if (orderDate < last7Days) return false;
                        break;
                    case 'last30days':
                        const last30Days = new Date(today.setDate(today.getDate() - 30));
                        if (orderDate < last30Days) return false;
                        break;
                    case 'last3months':
                        const last3Months = new Date(today.setMonth(today.getMonth() - 3));
                        if (orderDate < last3Months) return false;
                        break;
                    default:
                        break;
                }
            }
            
            const amount = parseFloat(order.monto_total);
            if (filters.minAmount && amount < parseFloat(filters.minAmount)) {
                return false;
            }
            if (filters.maxAmount && amount > parseFloat(filters.maxAmount)) {
                return false;
            }
            
            return true;
        });
    }, [orders, filters]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-verde-agua"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center pt-20">
                <div className="text-center p-4">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    if (!orders?.length) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-nude rounded-lg max-w-md w-full mx-4">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-600 text-lg mb-2">No tienes pedidos realizados</p>
                    <p className="text-gray-500 mb-4">¡Comienza a explorar nuestra tienda!</p>
                    <Link to="/shop" className="bg-verde-agua text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all inline-block">
                        Ir a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20">
            <div className="max-w-4xl mx-auto p-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-light mb-2">Historial de Pedidos</h1>
                    <p className="text-gray-600">Encuentra todos tus pedidos y sigue su estado</p>
                </div>
    
                {/* Filters Section - Desktop */}
                <div className="hidden md:block mb-6 bg-nude rounded-lg p-4">
                    <div className="flex justify-center items-center gap-4">
                        {/* Estado */}
                        <div className="relative">
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className={`w-56 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-verde-agua focus:border-verde-agua focus:outline-none bg-white ${
                                    filters.status ? 'border-verde-agua ring-1 ring-verde-agua' : ''
                                }`}
                            >
                                <option value="">Todos los estados</option>
                                {uniqueStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <FunnelIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
    
                        {/* Rango de fechas */}
                        <div className="relative">
                            <select
                                name="dateRange"
                                value={filters.dateRange}
                                onChange={handleFilterChange}
                                className={`w-56 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-verde-agua focus:border-verde-agua focus:outline-none bg-white ${
                                    filters.dateRange ? 'border-verde-agua ring-1 ring-verde-agua' : ''
                                }`}
                            >
                                <option value="">Todas las fechas</option>
                                <option value="last7days">Últimos 7 días</option>
                                <option value="last30days">Últimos 30 días</option>
                                <option value="last3months">Últimos 3 meses</option>
                            </select>
                            <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
    
                        {/* Monto */}
                        <div className="relative" ref={amountFilterRef}>
                            <button 
                                onClick={() => setIsAmountFilterOpen(!isAmountFilterOpen)}
                                className={`w-56 pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-verde-agua focus:border-verde-agua focus:outline-none flex items-center gap-2 ${
                                    isAmountFilterOpen || filters.minAmount || filters.maxAmount ? 'border-verde-agua ring-1 ring-verde-agua' : ''
                                }`}
                            >
                                <AdjustmentsHorizontalIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                                <span>Monto</span>
                            </button>
                            {isAmountFilterOpen && (
                                <div className="absolute mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Monto mínimo</label>
                                            <input
                                                type="number"
                                                ref={minAmountRef}
                                                defaultValue={filters.minAmount}
                                                onKeyDown={handleAmountKeyDown('minAmount')}
                                                placeholder="$0"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-verde-agua focus:border-verde-agua focus:outline-none bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Monto máximo</label>
                                            <input
                                                type="number"
                                                ref={maxAmountRef}
                                                defaultValue={filters.maxAmount}
                                                onKeyDown={handleAmountKeyDown('maxAmount')}
                                                placeholder="$9999"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-verde-agua focus:border-verde-agua focus:outline-none bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
    
                        {/* Limpiar filtros */}
                        {(filters.status || filters.dateRange || filters.minAmount || filters.maxAmount) && (
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-verde-agua flex items-center gap-2 transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5" />
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters - Mobile */}
                <div className="block md:hidden mb-4">
                    <button
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className="w-full bg-nude rounded-lg p-3 flex items-center justify-between"
                    >
                        <span className="font-medium">Filtros</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                                {(filters.status || filters.dateRange || filters.minAmount || filters.maxAmount) 
                                    ? 'Filtros activos' 
                                    : 'Sin filtros'
                                }
                            </span>
                            {isFiltersOpen ? (
                                <XMarkIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </div>
                    </button>

                    {isFiltersOpen && (
                        <div className="mt-2 bg-white rounded-lg shadow p-4 space-y-4">
                            {/* Estado */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Estado</label>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-verde-agua focus:border-verde-agua focus:outline-none bg-white ${
                                        filters.status ? 'border-verde-agua ring-1 ring-verde-agua' : ''
                                    }`}
                                >
                                    <option value="">Todos los estados</option>
                                    {uniqueStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Fecha */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Fecha</label>
                                <select
                                    name="dateRange"
                                    value={filters.dateRange}
                                    onChange={handleFilterChange}
                                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-verde-agua focus:border-verde-agua focus:outline-none bg-white ${
                                        filters.dateRange ? 'border-verde-agua ring-1 ring-verde-agua' : ''
                                    }`}
                                >
                                    <option value="">Todas las fechas</option>
                                    <option value="last7days">Últimos 7 días</option>
                                    <option value="last30days">Últimos 30 días</option>
                                    <option value="last3months">Últimos 3 meses</option>
                                </select>
                            </div>

                            {/* Monto */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Rango de monto</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        ref={minAmountRef}
                                        defaultValue={filters.minAmount}
                                        onKeyDown={handleAmountKeyDown('minAmount')}
                                        placeholder="Mínimo"
                                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-verde-agua focus:border-verde-agua focus:outline-none bg-white ${
                                            filters.minAmount ? 'border-verde-agua ring-1 ring-verde-agua' : ''
                                        }`}
                                    />
                                    <span className="self-center">-</span>
                                    <input
                                        type="number"
                                        ref={maxAmountRef}
                                        defaultValue={filters.maxAmount}
                                        onKeyDown={handleAmountKeyDown('maxAmount')}
                                        placeholder="Máximo"
                                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-verde-agua focus:border-verde-agua focus:outline-none bg-white ${
                                            filters.maxAmount ? 'border-verde-agua ring-1 ring-verde-agua' : ''
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Limpiar filtros */}
                            {(filters.status || filters.dateRange || filters.minAmount || filters.maxAmount) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="w-full px-4 py-2 text-sm text-gray-600 hover:text-verde-agua flex items-center justify-center gap-2 transition-colors"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    )}
                </div>
    
                {/* Orders List */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 bg-nude rounded-t-lg border-b border-gray-100">
                        <p className="text-center text-sm text-gray-600">
                            Mostrando <span className="font-medium text-verde-agua">{filteredOrders.length}</span> de {orders.length} pedidos
                        </p>
                    </div>
    
                    <div className="max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {filteredOrders.map((order) => (
                            <Link 
                                key={order.id_pedido}
                                to={`/my-orders/${order.id_pedido}`}
                                onClick={() => window.scrollTo(0, 0)}
                                className="block transition-all duration-300 hover:bg-gray-50"
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-lg font-medium">Pedido #{order.id_pedido}</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    order.estado.descripcion === 'Entregado' ? 'bg-green-100 text-green-800' :
                                                    order.estado.descripcion === 'Procesado' ? 'bg-blue-100 text-blue-800' :
                                                    order.estado.descripcion === 'Enviado' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-verde-agua/10 text-verde-agua'
                                                }`}>
                                                    {order.estado.descripcion}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 space-y-1">
                                                <p>{new Date(order.fecha).toLocaleDateString('es-AR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</p>
                                                <p>{order.detalles.length} {order.detalles.length === 1 ? 'producto' : 'productos'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-medium text-verde-agua">
                                                ${parseFloat(order.monto_total).toLocaleString('es-AR')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderList;