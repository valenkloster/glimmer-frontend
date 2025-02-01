import { createContext, useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
 const [orders, setOrders] = useState([]);
 const [selectedOrder, setSelectedOrder] = useState(null);
 const [monthlyStats, setMonthlyStats] = useState([]);
 const [topProducts, setTopProducts] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchOrders = async () => {
    const currentToken = localStorage.getItem('token');
    
    if (!currentToken) {
      setOrders([]);
      setSelectedOrder(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await orderService.getAll();
      setOrders(response.body || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los pedidos');
      setOrders([]);
      setSelectedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (orderId) => {
    // Si ya tenemos el pedido, no lo volvemos a cargar
    if (selectedOrder?.id_pedido === orderId) return;
  
    try {
      setLoading(true);
      const response = await orderService.getById(orderId);
      setSelectedOrder(response.body);
      setError(null);
    } catch (err) {
      setError('Error al cargar el pedido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkToken = () => {
      const newToken = localStorage.getItem('token');
      if (newToken !== token) {
        setToken(newToken);
        if (!newToken) {
          setOrders([]);
          setSelectedOrder(null);
        } else {
          fetchOrders();
        }
      }
    };

    window.addEventListener('storage', checkToken);
    const interval = setInterval(checkToken, 1000);
    fetchOrders();
    
    return () => {
      window.removeEventListener('storage', checkToken);
      clearInterval(interval);
    };
  }, [token]);

  const fetchMonthlyStats = async (month, year) => {
    try {
      setLoading(true);
      const response = await orderService.getMonthStats(month, year);
      setMonthlyStats(response.body || []);
      setError(null);
      return response.body;
    } catch (err) {
      setError('Error al cargar las estadísticas mensuales');
      setMonthlyStats([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchTop5Products = async (month, year) => {
    try {
      setLoading(true);
      const response = await orderService.getTop5Products(month, year);
      setTopProducts(response.body || []);
      setError(null);
      return response.body;
    } catch (err) {
      setError('Error al cargar los productos más vendidos');
      setTopProducts([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider 
      value={{ 
        orders,
        selectedOrder,
        monthlyStats,
        fetchMonthlyStats,
        topProducts,
        fetchTop5Products,
        loading,
        error,
        fetchOrders,
        fetchOrderById
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};