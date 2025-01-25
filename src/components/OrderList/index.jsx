import { useContext } from 'react';
import { OrderContext } from '../../context/order/OrderContext';
import { Link } from 'react-router-dom';

const OrderList = () => {
    const { orders, loading, error } = useContext(OrderContext);
  
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[calc(100vh-81px)]" style={{ marginTop: '81px' }}>
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-verde-agua"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex justify-center items-center pt-[81px]">
          <div className="text-center p-4">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      );
    }
  
    if (!orders?.length) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-81px)]">
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
      <div className="pt-[81px]">
        <div className="max-w-4xl mx-auto p-4">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-light mb-2">Historial de Pedidos</h1>
            <p className="text-gray-600">Encuentra todos tus pedidos y sigue su estado</p>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            {/* Summary Section */}
            <div className="p-4 bg-nude rounded-t-lg border-b border-gray-100">
              <p className="text-center text-sm text-gray-600">
                Tienes <span className="font-medium text-verde-agua">{orders.length}</span> {orders.length === 1 ? 'pedido realizado' : 'pedidos realizados'}
              </p>
            </div>
  
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {orders.map((order, index) => (
                <Link 
                  key={order.id_pedido}
                  to={`/orders/${order.id_pedido}`}
                  className={`block transition-all duration-300 hover:bg-gray-50 ${
                    index !== orders.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-medium">Pedido #{order.id_pedido}</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.estado.descripcion === 'Procesando' 
                              ? 'bg-blue-100 text-blue-800'
                              : order.estado.descripcion === 'Enviado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
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
                        <span className="text-sm text-gray-500 hover:text-verde-agua transition-colors">
                          Ver detalle →
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