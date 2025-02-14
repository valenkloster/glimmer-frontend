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

  // ==================== Estados de Filtros ====================
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOrder, setSortOrder] = useState('');

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
      await loadLowStockProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProductPrice = async (productId, newPrice) => {
    try {
      setLoading(true);
      await productService.updatePrice(productId, newPrice);
      const updatedProducts = await productService.getAll();
      setProducts(updatedProducts.body);
      setFilteredProducts(updatedProducts.body);
    } catch (error) {
      console.error('Error updating price:', error);
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

  // ==================== Funciones de Filtrado ====================
  const applyFilters = (productsToFilter) => {
    let result = [...productsToFilter];
  
    // Aplicar filtro de precio
    result = result.filter(product => {
      const precio = parseFloat(product.precio);
      const min = priceRange.min !== '' ? Number(priceRange.min) : null;
      const max = priceRange.max !== '' ? Number(priceRange.max) : null;
      
      // Validar solo mínimo
      if (min !== null && max === null) {
        return precio >= min;
      }
      // Validar solo máximo
      if (max !== null && min === null) {
        return precio <= max;
      }
      // Validar ambos
      if (min !== null && max !== null) {
        return precio >= min && precio <= max;
      }
      
      return true;
    });
  
    // Aplicar ordenamiento
    if (sortOrder) {
      result.sort((a, b) => {
        const precioA = parseFloat(a.precio);
        const precioB = parseFloat(b.precio);
        
        switch (sortOrder) {
          case 'price-asc':
            return precioA - precioB;
          case 'price-desc':
            return precioB - precioA;
          case 'name-asc':
            return a.nombre.localeCompare(b.nombre);
          case 'name-desc':
            return b.nombre.localeCompare(a.nombre);
          default:
            return 0;
        }
      });
    }
  
    return result;
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

  // Filtrar productos por categoría y aplicar filtros adicionales
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        let productsToFilter;

        if (selectedCategory) {
          const response = await productService.getByCategory(selectedCategory);
          productsToFilter = response.body;
        } else {
          productsToFilter = products;
        }

        // Aplicar filtros adicionales
        const filteredResult = applyFilters(productsToFilter);
        setFilteredProducts(filteredResult);
      } catch (error) {
        console.error('Error fetching products by category:', error);
        setFilteredProducts(products);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [selectedCategory, products, priceRange, sortOrder]);

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
    updateProductPrice,

    // Filter State
    priceRange,
    setPriceRange,
    sortOrder,
    setSortOrder,

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