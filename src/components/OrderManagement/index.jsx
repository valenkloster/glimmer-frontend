import React, { useEffect, useState, useContext } from 'react';
import { OrderContext } from '../../context/order/OrderContext';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const OrderStatus = {
  1: { name: 'Entregado', class: 'bg-green-100 text-green-800' },
  2: { name: 'Procesado', class: 'bg-blue-100 text-blue-800' },
  3: { name: 'Enviado', class: 'bg-yellow-100 text-yellow-800' }
};

const OrderManagement = () => {
  const {
    orders,
    loading,
    error,
    filters,
    fetchAllOrders,
    updateOrderStatus,
    updateFilters
  } = useContext(OrderContext);

  const [showFilters, setShowFilters] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0 || isSearching) {
      setShowContent(false);
      const timer = setTimeout(() => {
        setShowContent(true);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(true);
    }
  }, [orders, isSearching]);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, parseInt(newStatus));
  };

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value });
  };

  const handleSearch = () => {
    setIsSearching(true);
    fetchAllOrders(filters);
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS'
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-product text-gray-800">
          Gestión de Pedidos
        </h1>
        <div className="md:hidden">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 border shadow-sm"
          >
            <FunnelIcon className="w-4 h-4" />
            Filtros
            {showFilters ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm w-full">
        <div className="p-4">
          <div className={`${showFilters ? 'max-h-96' : 'max-h-0'} md:max-h-96 overflow-hidden transition-all duration-300 ease-in-out`}>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4 border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <select
                    value={filters.estado}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                    className="w-full p-2 pl-3 border rounded-lg appearance-none bg-white hover:border-verde-agua focus:border-verde-agua focus:ring-1 focus:ring-verde-agua transition-colors duration-200"
                  >
                    <option value="">Todos los estados</option>
                    {Object.entries(OrderStatus).map(([id, { name }]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <input
                  type="text"
                  placeholder="Buscar por ID Pedido o Cliente..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full p-2 pl-3 border rounded-lg hover:border-verde-agua focus:border-verde-agua focus:ring-1 focus:ring-verde-agua transition-colors duration-200"
                />

                <button 
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-verde-agua text-white rounded-lg hover:bg-verde-agua/90 active:bg-verde-agua/80 transition-all duration-200 transform active:scale-95"
                >
                  <MagnifyingGlassIcon className="w-4 h-4" />
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <div className={`overflow-x-auto transition-all duration-1000 ease-in-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">ID Cliente</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Cliente</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Fecha</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Monto Total</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Estado</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id_pedido} className="border-b hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-3 px-4">{order.id_pedido}</td>
                    <td className="py-3 px-4 font-medium">
                      {order.cliente?.nombre} {order.cliente?.apellido}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                    {new Date(order.fecha).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {formatPrice(order.monto_total)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${OrderStatus[order.id_estado_pedido]?.class}`}>
                        {OrderStatus[order.id_estado_pedido]?.name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <select
                          value={order.id_estado_pedido}
                          onChange={(e) => handleStatusChange(order.id_pedido, e.target.value)}
                          className="w-full p-2 border rounded-lg appearance-none hover:border-verde-agua focus:border-verde-agua focus:ring-1 focus:ring-verde-agua transition-colors duration-200"
                        >
                          {Object.entries(OrderStatus).map(([id, { name }]) => (
                            <option key={id} value={id}>{name}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-verde-agua"></div>
            </div>
          )}
          {error && (
            <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No se encontraron pedidos
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;