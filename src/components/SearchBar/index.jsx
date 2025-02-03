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
  const [isNavigating, setIsNavigating] = useState(false);
  const { setFilteredProducts } = useContext(ShoppingCartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim() || isNavigating) return;
    
    setIsLoading(true);
    try {
      const response = await productService.searchProducts(searchQuery);
      setFilteredProducts(response.body || []);
      // Solo navegamos si la búsqueda fue exitosa
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      // Aquí podrías agregar un estado para mostrar el error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    const searchQuery = query.trim();
    if (!searchQuery || isLoading) return;

    setIsNavigating(true);
    await performSearch(searchQuery);
    setIsNavigating(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Manejar búsqueda inicial cuando se carga la página con una URL de búsqueda
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery && !isNavigating) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [location.search]);

  // Manejo de clics fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => setIsSearchActive(!isSearchActive)}
        className="focus:outline-none hover:opacity-75 transition-opacity"
        aria-label="Abrir búsqueda"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>
      
      {isSearchActive && (
        <div className="fixed md:absolute left-0 md:left-auto right-0 md:right-0 top-20 md:top-auto mt-0 md:mt-2 w-full md:w-96 px-4 md:px-0 z-50">
          <div className="mx-auto md:mx-0 max-w-lg md:max-w-none bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Buscar productos..."
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-agua"
                autoFocus
                aria-label="Campo de búsqueda"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                className="px-4 py-2 bg-verde-agua text-white rounded-lg hover:bg-verde-agua/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out flex items-center justify-center min-w-[44px]"
                aria-label="Buscar"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <MagnifyingGlassIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;