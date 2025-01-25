import { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../../services/cartService';
import { productService } from '../../services/productService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const loadCart = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cartResponse = await cartService.getAll();
      
      if (cartResponse.detalles && cartResponse.detalles.length > 0) {
        const detallesOrdenados = [...cartResponse.detalles].sort((a, b) => 
          a.id_carrito_detalle - b.id_carrito_detalle
        );

        const detallesWithProducts = await Promise.all(
          detallesOrdenados.map(async (detalle) => {
            const productResponse = await productService.getById(detalle.id_producto);
            return {
              ...detalle,
              producto: productResponse.body
            };
          })
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
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
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
          const productResponse = await productService.getById(detalle.id_producto);
          return {
            ...detalle,
            producto: {
              ...detalle.producto,
              stock: productResponse.body.stock
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

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartService.add(productId, quantity);
      if (response.error === false && response.status === 200) {
        await loadCart();
      }
    } catch (err) {
      setError('Error al agregar al carrito');
      console.error('Error adding to cart:', err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    try {
      setUpdatingItems(prev => new Set(prev).add(productId));
      const response = await cartService.update(productId, quantity);
  
      if (response.error === false && response.status === 200) {
        setCart(prevCart => ({
          ...prevCart,
          detalles: prevCart.detalles.map(item =>
            item.id_producto === productId
              ? { ...item, cantidad: quantity }
              : item
          )
        }));
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
        await loadCart();
      }
    } catch (err) {
      await loadCart();
      setError('Error al eliminar del carrito');
      console.error('Error removing from cart:', err);
    }
  };

  const adjustCartQuantities = async (stockIssues) => {
    try {
      await Promise.all(
        stockIssues.map(item => 
          updateQuantity(item.id_producto, item.producto.stock)
        )
      );
    } catch (err) {
      setError('Error al ajustar cantidades');
      console.error('Error adjusting quantities:', err);
    }
  };

  const openCart = async () => {
    setIsCartOpen(true);
    await checkStock();
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

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