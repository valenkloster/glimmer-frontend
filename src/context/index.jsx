import { createContext, useState, useEffect } from 'react';
import { productService, categoryService } from '../services/api';

export const ShoppingCartContext = createContext();

export const ShoppingCartProvider = ({ children }) => {
  // ==================== Estado del Carrito ====================
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

  // Persistencia del carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartProducts));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartProducts]);

  // ==================== Estados de UI ====================
  const [isCheckoutSideMenuOpen, setIsCheckoutSideMenuOpen] = useState(false);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ==================== Estados de Productos y Categorías ====================
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productToShow, setProductToShow] = useState({});

  // ==================== Controladores de UI ====================
  const openCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(true);
  const closeCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(false);
  const openProductDetail = () => setIsProductDetailOpen(true);
  const closeProductDetail = () => setIsProductDetailOpen(false);

  // ==================== Controladores del Carrito ====================
  const addProductToCart = (event, productData) => {
    event?.stopPropagation();
    
    if (productData.stock <= 0) return;

    const existingProduct = cartProducts.find(
      product => product.id_producto === productData.id_producto
    );

    if (existingProduct) {
      if (existingProduct.quantity < productData.stock) {
        const updatedProducts = cartProducts.map(product => 
          product.id_producto === productData.id_producto 
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
        setCartProducts(updatedProducts);
      }
    } else {
      const productWithQuantity = { ...productData, quantity: 1 };
      setCartProducts([...cartProducts, productWithQuantity]);
      setCount(count + 1);
    }

    openCheckoutSideMenu();
    closeProductDetail();
  };

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
    const filteredProducts = cartProducts.filter(
      (product) => product.id_producto !== id
    );
    setCartProducts(filteredProducts);
    setCount(count - 1);
  };

  // ==================== Controladores de Productos y Categorías ====================
  const clearSelectedCategory = () => {
    setSelectedCategory(null);
    setFilteredProducts(products);
  };

  // Cargar datos iniciales
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
  }, [selectedCategory, products]);

  // ==================== Valor del Contexto ====================
  const contextValue = {
    // Cart State
    count,
    setCount,
    cartProducts,
    setCartProducts,

    // UI State
    isCheckoutSideMenuOpen,
    isProductDetailOpen,
    loading,

    // Product and Category State
    products,
    filteredProducts,
    categories,
    selectedCategory,
    productToShow,

    // UI Controllers
    openCheckoutSideMenu,
    closeCheckoutSideMenu,
    openProductDetail,
    closeProductDetail,
    setProductToShow,

    // Cart Controllers
    addProductToCart,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleDeleteFromCart,

    // Category Controllers
    setSelectedCategory,
    clearSelectedCategory
  };

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
};