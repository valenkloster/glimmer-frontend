import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OrderContext } from '../../context/order/OrderContext';

const OrderDetail = () => {
  const { id } = useParams();
  const { selectedOrder, loading, error, fetchOrderById } = useContext(OrderContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id]);

  useEffect(() => {
    if (selectedOrder) {
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
    return () => setIsVisible(false);
  }, [selectedOrder]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-223px)] max-w-3xl mx-auto p-4 pt-[120px]">
        <div className="text-center p-4">
          <p className="text-red-500">{error}</p>
          <Link to="/my-orders" className="text-verde-agua hover:underline mt-2 inline-block">
            Volver a mis pedidos
          </Link>
        </div>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="min-h-[calc(100vh-223px)] max-w-3xl mx-auto p-4 pt-[120px]">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-verde-agua"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-223px)] max-w-3xl mx-auto p-4 pt-[120px] transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex flex-col justify-center h-full">
        <div className="mb-4">
          <Link to="/my-orders" className="text-verde-agua hover:underline">
            ← Volver a mis pedidos
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="border-b pb-4 mb-4">
            <h1 className="text-2xl pb-3 font-medium">Pedido #{selectedOrder.id_pedido}</h1>
            <p className="text-gray-600 my-1 flex items-center gap-2">
              <span className="font-medium">Fecha de compra:</span>
              {new Date(selectedOrder.fecha).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
            <p className="text-gray-600 my-1 flex items-center gap-2">
              <span className="font-medium">Fecha de entrega estimada:</span>
              {new Date(selectedOrder.fecha_entrega_estimada).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
            <p className="text-gray-600 font-medium flex items-center gap-2">
              Estado: 
              <span className={`my-1 px-3 py-1 rounded-full text-sm font-medium ${
                selectedOrder.estado.descripcion === 'Entregado' ? 'bg-green-100 text-green-800' :
                selectedOrder.estado.descripcion === 'Procesado' ? 'bg-blue-100 text-blue-800' :
                selectedOrder.estado.descripcion === 'Enviado' ? 'bg-yellow-100 text-yellow-800' :
                'bg-verde-agua/10 text-verde-agua'
              }`}>
                {selectedOrder.estado.descripcion}
              </span>
            </p>
            <div className="text-gray-600 my-1">
              <p className="font-medium mb-1">Dirección de entrega:</p>
              <p className="ml-2">{selectedOrder.cliente_direccion.direccion}</p>
              {selectedOrder.cliente_direccion.departamento && 
                <p className="ml-2">Departamento: {selectedOrder.cliente_direccion.departamento}</p>
              }
              <p className="ml-2">CP: {selectedOrder.cliente_direccion.codigo_postal}</p>
              <p className="ml-2">
                {selectedOrder.cliente_direccion.localidad.nombre}, 
                {selectedOrder.cliente_direccion.localidad.provincia.nombre}, 
                {selectedOrder.cliente_direccion.localidad.provincia.pais.nombre}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Productos</h2>
            <div className="space-y-4">
              {selectedOrder.detalles.map((item) => (
                <div key={item.id_pedido_detalle} className="flex items-center gap-4 p-3 border rounded-lg">
                  <Link 
                    to={`/products/${item.producto.id_producto}`} 
                    onClick={() => window.scrollTo(0, 0)}
                    className="flex items-center gap-4 flex-1 hover:opacity-90"
                  >
                    <img 
                      src={item.producto.imagen} 
                      alt={item.producto.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.producto.nombre}</p>
                      <p className="text-sm text-gray-600">{item.producto.marca}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                    </div>
                    <p className="font-medium">
                      ${parseFloat(item.precio).toLocaleString('es-AR')}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-black">Subtotal</span>
              <span className="text-black">
                ${parseFloat(selectedOrder.monto_productos).toLocaleString('es-AR')}
              </span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-black">Costo de envío</span>
                <span className="text-xs text-gray-500 block">(IVA incluido)</span>
              </div>
              <span className="text-black">
                ${parseFloat(selectedOrder.monto_envio).toLocaleString('es-AR')}
              </span>
            </div>

            <div className="flex justify-between items-center text-lg font-medium border-t pt-4 mt-2">
              <span>Total</span>
              <span>
                ${parseFloat(selectedOrder.monto_total).toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;