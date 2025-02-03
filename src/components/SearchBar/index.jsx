import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ShoppingCartContext } from '../../context';
import { useContext } from 'react';

const SearchBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { setFilteredProducts } = useContext(ShoppingCartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const abortControllerRef = useRef(null);
  const lastSearchRef = useRef(''); // Para trackear la última búsqueda iniciada

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    // Cancelar búsqueda anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Guardar la búsqueda actual como la última iniciada
    lastSearchRef.current = searchQuery;

    // Crear nuevo controlador para esta búsqueda
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    try {
      const response = await productService.searchProducts(
        searchQuery,
        { signal: abortControllerRef.current.signal }
      );
      
      // Solo actualizar los resultados si esta es aún la última búsqueda iniciada
      if (lastSearchRef.current === searchQuery) {
        setFilteredProducts(response.body || []);
        // Solo actualizar la URL si es la búsqueda más reciente
        navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error:', error);
      // Solo limpiar resultados si es la búsqueda más reciente
      if (lastSearchRef.current === searchQuery) {
        setFilteredProducts([]);
      }
    } finally {
      // Solo actualizar estado de carga si es la búsqueda más reciente
      if (lastSearchRef.current === searchQuery) {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const searchQuery = query.trim();
      if (searchQuery) {
        await performSearch(searchQuery);
      }
    }
  };

  // Para manejar la búsqueda inicial desde URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [location.search]);

  // Cleanup al desmontar o cerrar la búsqueda
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
        setQuery('');
        setFilteredProducts([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [setFilteredProducts]);

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => setIsSearchActive(!isSearchActive)}
        className="focus:outline-none"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>
      
      {isSearchActive && (
        <div className="fixed md:absolute left-0 md:left-auto right-0 md:right-0 top-20 md:top-auto mt-0 md:mt-2 w-full md:w-72 px-4 md:px-0">
          <div className="mx-auto md:mx-0 max-w-lg md:max-w-none bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-100">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Buscar productos..."
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-agua"
                autoFocus
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-verde-agua"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;