import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { cartService } from '../../services/cartService';
import { productService } from '../../services/productService';

export const CartContext = createContext();

// Cache global para productos
const PRODUCTS_CACHE = new Map();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const isAdminUser = useCallback(() => {
    const userInfo = localStorage.getItem('user');
    if (!userInfo) return false;
    
    try {
      const user = JSON.parse(userInfo);
      return user.role === 'admin';
    } catch (err) {
      console.error('Error al parsear información del usuario:', err);
      return false;
    }
  }, []);

  // Función para obtener producto del cache o del servidor
  const getProductFromCache = async (productId) => {
    if (PRODUCTS_CACHE.has(productId)) {
      return PRODUCTS_CACHE.get(productId);
    }
    
    const productResponse = await productService.getById(productId);
    PRODUCTS_CACHE.set(productId, productResponse.body);
    return productResponse.body;
  };
  
  const loadCart = async () => {
    const token = localStorage.getItem('token');
    
    if (!token || isAdminUser()) {
      setCart(null);
      setLoading(false);
      return;
    }
  
    try {
      setLoading(true);
      const cartResponse = await cartService.getAll();
      
      if (cartResponse.detalles?.length > 0) {
        const detallesOrdenados = [...cartResponse.detalles].sort((a, b) => 
          a.id_carrito_detalle - b.id_carrito_detalle
        );

        const detallesWithProducts = await Promise.all(
          detallesOrdenados.map(async (detalle) => ({
            ...detalle,
            producto: await getProductFromCache(detalle.id_producto)
          }))
        );

        setCart({
          ...cartResponse,
          detalles: detallesWithProducts
        });
      } else {
        setCart(cartResponse);
      }

      setError(null);
    } catch (err) {
      setError('Error al cargar el carrito');
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        loadCart();
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
    loadCart();
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkStock = async () => {
    if (!cart?.detalles?.length) return;
    
    try {
      const updatedDetalles = await Promise.all(
        cart.detalles.map(async (detalle) => {
          const producto = await getProductFromCache(detalle.id_producto);
          return {
            ...detalle,
            producto: {
              ...detalle.producto,
              stock: producto.stock
            }
          };
        })
      );
      
      setCart(prev => ({
        ...prev,
        detalles: updatedDetalles
      }));

      return updatedDetalles;
    } catch (error) {
      console.error('Error checking stock:', error);
      setError('Error al verificar stock');
    }
  };

  const addToCart = async (productId, quantity = 1, productData = null) => {
    try {
      // Optimistic update
      if (productData) {
        setCart(prevCart => ({
          ...prevCart,
          detalles: [
            ...(prevCart?.detalles || []),
            {
              id_producto: productId,
              cantidad: quantity,
              producto: productData
            }
          ]
        }));
      }

      const response = await cartService.add(productId, quantity);
      
      if (response.error || response.status !== 200) {
        // Revert optimistic update if failed
        await loadCart();
      }
    } catch (err) {
      setError('Error al agregar al carrito');
      await loadCart(); // Revert on error
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    try {
      setUpdatingItems(prev => new Set(prev).add(productId));
      
      // Optimistic update
      setCart(prevCart => ({
        ...prevCart,
        detalles: prevCart.detalles.map(item =>
          item.id_producto === productId
            ? { ...item, cantidad: quantity }
            : item
        )
      }));

      const response = await cartService.update(productId, quantity);
  
      if (response.error || response.status !== 200) {
        await loadCart(); // Revert if failed
      }
    } catch (err) {
      setError('Error al actualizar cantidad');
      await loadCart();
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };
  
  const removeFromCart = async (productId) => {
    try {
      // Optimistic update
      setCart(prevCart => {
        const newDetalles = prevCart.detalles.filter(item => item.id_producto !== productId);
        
        const newTotal = newDetalles.reduce((total, item) => 
          total + (parseFloat(item.cantidad) * parseFloat(item.producto.precio)), 
          0
        );
  
        return {
          ...prevCart,
          detalles: newDetalles,
          monto_total: newTotal.toFixed(2)
        };
      });
  
      const response = await cartService.remove(productId);
      if (response.error || response.status !== 200) {
        await loadCart(); // Revert if failed
      }
    } catch (err) {
      setError('Error al eliminar del carrito');
      await loadCart();
    }
  };

  const adjustCartQuantities = async (stockIssues) => {
    try {
      await Promise.all(
        stockIssues.map(async (item) => {
          await updateQuantity(item.id_producto, item.producto.stock);
        })
      );
    } catch (err) {
      setError('Error al ajustar cantidades');
      console.error('Error adjusting quantities:', err);
    }
  };

  const openCart = useCallback(async () => {
    setIsCartOpen(true);
    await checkStock();
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Memoized calculations
  const cartCount = cart?.detalles?.length || 0;
  
  const cartTotal = cart?.detalles?.reduce((total, item) => 
    total + (item.producto.stock > 0 ? parseFloat(item.cantidad) * parseFloat(item.producto.precio) : 0), 
    0
  ) || 0;

  const contextValue = {
    cart,
    loading,
    error,
    isCartOpen,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    openCart,
    closeCart,
    loadCart,
    updatingItems,
    adjustCartQuantities,
    checkStock,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};