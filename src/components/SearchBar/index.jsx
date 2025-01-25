import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ShoppingCartContext } from '../../context';
import { useContext } from 'react';
import _ from 'lodash';

const SearchBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { setFilteredProducts } = useContext(ShoppingCartContext);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const debouncedSearch = useRef(
    _.debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setFilteredProducts([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await productService.searchProducts(searchQuery);
        setFilteredProducts(response.body || []);
        navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      } catch (error) {
        console.error('Error:', error);
      }
      setIsLoading(false);
    }, 500)
  ).current;

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
  };
  
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsLoading(true);
      try {
        const response = await productService.searchProducts(query);
        setFilteredProducts(response.body || []);
        navigate(`/shop?search=${encodeURIComponent(query)}`);
      } catch (error) {
        console.error('Error:', error);
      }
      setIsLoading(false);
    }
  };

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
      debouncedSearch.cancel();
    };
  }, []);

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
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            onKeyDown={handleKeyPress}
            placeholder="Buscar productos..."
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-agua"
            autoFocus
          />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;