import { useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OrderContext } from '../../context/order/OrderContext';

const OrderDetail = () => {
  const { orderId } = useParams();
  const { selectedOrder, loading, error, fetchOrderById } = useContext(OrderContext);

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-verde-agua"></div>
    </div>
  );

  if (error) return (
    <div className="text-center p-4">
      <p className="text-red-500">{error}</p>
      <Link to="/orders" className="text-verde-agua hover:underline mt-2 inline-block">
        Volver a mis pedidos
      </Link>
    </div>
  );

  if (!selectedOrder) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 pt-[80px]">
      <div className="mb-4">
        <Link to="/orders" className="text-verde-agua hover:underline">
          ← Volver a mis pedidos
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-medium">Pedido #{selectedOrder.id_pedido}</h1>
          <p className="text-gray-600">
            Fecha: {new Date(selectedOrder.fecha).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            Estado: {selectedOrder.estado.descripcion}
          </p>
          <p className="text-gray-600">
            Dirección de entrega: {selectedOrder.cliente_direccion.direccion}
            {selectedOrder.cliente_direccion.departamento && `, ${selectedOrder.cliente_direccion.departamento}`}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Productos</h2>
          <div className="space-y-4">
            {selectedOrder.detalles.map((item) => (
              <div key={item.id_pedido_detalle} className="flex items-center gap-4 p-3 border rounded-lg">
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
                <p className="font-medium">${parseFloat(item.precio).toLocaleString('es-AR')}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-medium">
            <span>Total</span>
            <span>${parseFloat(selectedOrder.monto_total).toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;