import { createContext, useState, useEffect } from 'react';
import { productService, categoryService } from '../services';

export const ShoppingCartContext = createContext();

export const ShoppingCartProvider = ({ children }) => {
  // ==================== Estados de UI ====================
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ==================== Estados de Productos y Categorías ====================
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productToShow, setProductToShow] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const loadLowStockProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getLowStock();
      setLowStockProducts(response.body);
    } catch (error) {
      console.error('Error loading low stock products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateProductStock = async (productId, newStock) => {
    try {
      setLoading(true);
      await productService.updateStock(productId, newStock);
      await loadLowStockProducts(); // Recargar lista después de actualizar
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProducts(products);
  };

  // ==================== Controladores de UI ====================
  const openProductDetail = () => setIsProductDetailOpen(true);
  const closeProductDetail = () => setIsProductDetailOpen(false);

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
    // UI State
    isProductDetailOpen,
    loading,

    // Product and Category State
    products,
    filteredProducts,
    categories,
    selectedCategory,
    productToShow,
    searchQuery,
    setSearchQuery,
    setFilteredProducts,
    clearSearch,
    lowStockProducts,
    loadLowStockProducts,
    updateProductStock,

    // UI Controllers
    openProductDetail,
    closeProductDetail,
    setProductToShow,

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