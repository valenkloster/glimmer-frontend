import { createContext, useState, useEffect } from 'react';
import { productService, categoryService } from '../services/api';

export const ShoppingCartContext = createContext();

export const ShoppingCartProvider = ({ children }) => {
  // SHOPPING CART
  const [count, setCount] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);
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

  // Filtrar productos cuando cambia la categoría seleccionada
  // En el efecto de filtrado dentro del ShoppingCartContext:

  useEffect(() => {
    if (!products.length) return;
    
    if (!selectedCategory) {
      setFilteredProducts(products);
      return;
    }

    const selectedCategoryData = categories.find(cat => cat.id_categoria === selectedCategory);
    
    if (selectedCategoryData?.id_categoria_padre) {
      // Si es una categoría hija, mostrar solo sus productos
      setFilteredProducts(products.filter(product => 
        product.id_categoria === selectedCategory
      ));
    } else {
      // Si es una categoría padre, mostrar productos de ella y sus subcategorías
      const childCategories = selectedCategoryData.subcategorias.map(sub => sub.id_categoria);
      
      setFilteredProducts(products.filter(product => 
        childCategories.includes(product.id_categoria)
      ));
    }
  }, [selectedCategory, products, categories]);

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
      // Mantener los productos actuales en caso de error
      setFilteredProducts(products);
    } finally {
      setLoading(false);
    }
  };

  fetchProductsByCategory();
}, [selectedCategory]);

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
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};