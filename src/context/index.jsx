import { createContext, useState, useEffect } from 'react';
import { productService, categoryService } from '../services/api';

export const ShoppingCartContext = createContext();

export const ShoppingCartProvider = ({ children }) => {
  // SHOPPING CART - Inicializar con datos del localStorage
  const [cartProducts, setCartProducts] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  
  const [count, setCount] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart).length : 0;
    } catch (error) {
      return 0;
    }
  });

  const [isCheckoutSideMenuOpen, setIsCheckoutSideMenuOpen] = useState(false);
  const openCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(true);
  const closeCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(false);

  // PRODUCT DETAIL
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const openProductDetail = () => setIsProductDetailOpen(true);
  const closeProductDetail = () => setIsProductDetailOpen(false);
  const [productToShow, setProductToShow] = useState({});

  // PRODUCTS AND CATEGORIES
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lógica centralizada del carrito
  const addProductToCart = (event, productData) => {
    event?.stopPropagation();
    
    // Verificar stock
    if (productData.stock <= 0) {
      return;
    }

    // Verificar si el producto ya está en el carrito
    const existingProduct = cartProducts.find(
      product => product.id_producto === productData.id_producto
    );

    if (existingProduct) {
      // Si ya está en el carrito, actualizamos la cantidad si hay stock suficiente
      if (existingProduct.quantity < productData.stock) {
        const updatedProducts = cartProducts.map(product => 
          product.id_producto === productData.id_producto 
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
        setCartProducts(updatedProducts);
      }
    } else {
      // Si no está en el carrito, lo agregamos
      const productWithQuantity = { ...productData, quantity: 1 };
      setCartProducts([...cartProducts, productWithQuantity]);
      setCount(count + 1);
    }

    openCheckoutSideMenu();
    closeProductDetail();
  };

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartProducts));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartProducts]);

  // Cargar productos y categorías
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productService.getAll(),
          categoryService.getAll()
        ]);
        
        setProducts(productsResponse.body);
        setFilteredProducts(productsResponse.body);
        setCategories(categoriesResponse.body);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar productos por categoría
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredProducts(products);
      return;
    }

    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        const response = await productService.getByCategory(selectedCategory);
        setFilteredProducts(response.body);
      } catch (error) {
        console.error('Error fetching products by category:', error);
        setFilteredProducts(products);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [selectedCategory]);

  const handleDecreaseQuantity = (id) => {
    const updatedProducts = cartProducts.map((product) => {
      if (product.id_producto === id) {
        const newQuantity = Math.max(1, (product.quantity || 1) - 1);
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setCartProducts(updatedProducts);
  };

  const handleIncreaseQuantity = (id) => {
    const updatedProducts = cartProducts.map((product) => {
      if (product.id_producto === id) {
        if ((product.quantity || 1) < product.stock) {
          return { ...product, quantity: (product.quantity || 1) + 1 };
        }
      }
      return product;
    });
    setCartProducts(updatedProducts);
  };

  const handleDeleteFromCart = (id) => {
    const filteredProducts = cartProducts.filter((product) => product.id_producto !== id);
    setCartProducts(filteredProducts);
    setCount(count - 1);
  };

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
        products,
        filteredProducts,
        categories,
        selectedCategory,
        setSelectedCategory,
        loading,
        addProductToCart,
        handleDecreaseQuantity,
        handleIncreaseQuantity,
        handleDeleteFromCart
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};