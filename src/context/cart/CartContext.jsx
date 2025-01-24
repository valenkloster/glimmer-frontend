import { createContext, useState, useEffect } from 'react';
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
        await loadCart();
      }
    } catch (err) {
      setError('Error al actualizar cantidad');
      console.error('Error updating quantity:', err);
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


  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cart?.detalles?.length || 0;
  const cartTotal = parseFloat(cart?.monto_total || 0);

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
    updatingItems
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