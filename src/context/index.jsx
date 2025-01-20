import { createContext, useState, useEffect } from 'react';

export const ShoppingCartContext = createContext();

export const ShoppingCartProvider = ({ children }) => {
  // SHOPPING CART
  const [count, setCount] = useState(0); // Contador de productos
  const [cartProducts, setCartProducts] = useState([]); // Productos en el carrito
  const [isCheckoutSideMenuOpen, setIsCheckoutSideMenuOpen] = useState(false); // Estado del menú lateral
  const openCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(true);
  const closeCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(false);

  // PRODUCT DETAIL
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false); // Estado del detalle del producto
  const openProductDetail = () => setIsProductDetailOpen(true);
  const closeProductDetail = () => setIsProductDetailOpen(false);
  const [productToShow, setProductToShow] = useState({}); // Producto a mostrar en el detalle

  // PRODUCTS
  const [products, setProducts] = useState([]); // Productos disponibles en la tienda
  const [loading, setLoading] = useState(true); // Estado de carga

  // Cargar productos desde la API
  useEffect(() => {
    fetch('https://api.escuelajs.co/api/v1/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar los productos:', error);
        setLoading(false);
      });
  }, []);

  return (
    <ShoppingCartContext.Provider
      value={{
        count,
        setCount,
        openProductDetail,
        closeProductDetail,
        isProductDetailOpen,
        productToShow,
        setProductToShow,
        cartProducts,
        setCartProducts,
        isCheckoutSideMenuOpen,
        openCheckoutSideMenu,
        closeCheckoutSideMenu,
        products, // Aquí se incluyen los productos
        loading,  // Aquí se maneja el estado de carga
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};
