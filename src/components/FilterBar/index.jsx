import React, { useState, useRef, useEffect } from 'react';
import { useContext } from 'react';
import { ShoppingCartContext } from '../../context';
import { FunnelIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const FilterBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState({ min: '', max: '' });
  const minInputRef = useRef(null);
  const maxInputRef = useRef(null);
  
  const { 
    setPriceRange, 
    setSortOrder,
    priceRange,
    sortOrder
  } = useContext(ShoppingCartContext);

  useEffect(() => {
    if (minInputRef.current) minInputRef.current.value = priceRange.min?.toString() || '';
    if (maxInputRef.current) maxInputRef.current.value = priceRange.max?.toString() || '';
  }, [priceRange]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !isOpen) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handlePriceFilter = () => {
    const minValue = minInputRef.current?.value || '';
    const maxValue = maxInputRef.current?.value || '';
    
    setError({ min: '', max: '' });
    
    if (minValue !== '' && Number(minValue) <= 0) {
      setError(prev => ({
        ...prev,
        min: 'Ingrese un número positivo'
      }));
      return;
    }
    
    if (maxValue !== '' && Number(maxValue) <= 0) {
      setError(prev => ({
        ...prev,
        max: 'Ingrese un número positivo'
      }));
      return;
    }

    if (minValue !== '' && maxValue !== '' && Number(minValue) > Number(maxValue)) {
      setError({
        min: 'El mínimo no puede ser mayor al máximo',
        max: 'El máximo no puede ser menor al mínimo'
      });
      return;
    }

    const newPriceRange = {
      min: minValue === '' ? '' : Number(minValue),
      max: maxValue === '' ? '' : Number(maxValue)
    };

    setPriceRange(newPriceRange);
    
    if (window.innerWidth < 768 && !error.min && !error.max) {
      setIsOpen(false);
    }
  };

  const handlePriceSubmit = (type) => (e) => {
    if (e.key === 'Enter') {
      handlePriceFilter();
      e.target.blur();
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    if (minInputRef.current) minInputRef.current.value = '';
    if (maxInputRef.current) maxInputRef.current.value = '';
    setSortOrder('');
    setError({ min: '', max: '' });
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const FilterContent = () => (
    <div className="flex flex-col md:flex-row justify-center md:items-center gap-4 w-full">
      {/* Filtro de precio */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
        <span className="font-product font-medium whitespace-nowrap">Precio:</span>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex flex-col relative flex-1 md:flex-none">
            <input
              type="number"
              placeholder="Mínimo"
              className={`w-full md:w-24 p-2 border rounded ${
                error.min ? 'border-red-500' : ''
              }`}
              ref={minInputRef}
              defaultValue={priceRange.min}
              onKeyDown={handlePriceSubmit('min')}
              onWheel={(e) => e.target.blur()}
            />
            {error.min && (
              <div className="absolute -bottom-6 left-0 bg-red-100 text-red-500 text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {error.min}
              </div>
            )}
          </div>
          <span>-</span>
          <div className="flex flex-col relative flex-1 md:flex-none">
            <input
              type="number"
              placeholder="Máximo"
              className={`w-full md:w-24 p-2 border rounded ${
                error.max ? 'border-red-500' : ''
              }`}
              ref={maxInputRef}
              defaultValue={priceRange.max}
              onKeyDown={handlePriceSubmit('max')}
              onWheel={(e) => e.target.blur()}
            />
            {error.max && (
              <div className="absolute -bottom-6 left-0 bg-red-100 text-red-500 text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {error.max}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ordenamiento */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
        <span className="font-product font-medium whitespace-nowrap">Ordenar por:</span>
        <select
          className="w-full md:w-60 p-2 border rounded text-ellipsis"
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="">Seleccionar</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
        {/* Botón de búsqueda */}
        <button
          onClick={handlePriceFilter}
          className="w-full md:w-auto flex items-center justify-center gap-1 px-3 py-2 bg-verde-agua hover:bg-verde-agua/80 text-white rounded-lg"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          <span>Buscar</span>
        </button>

        {/* Botón para limpiar filtros */}
        {(priceRange.min || priceRange.max || sortOrder) && (
          <button
            onClick={clearFilters}
            className="w-full md:w-auto px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 whitespace-nowrap"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-nude shadow-md rounded-lg mb-6">
      {/* Versión móvil */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between text-gray-700"
        >
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5" />
            <span className="font-medium">Filtros</span>
          </div>
          <div className="flex items-center gap-2">
            {(priceRange.min || priceRange.max || sortOrder) && (
              <span className="text-sm text-verde-agua font-medium">
                Filtros activos
              </span>
            )}
            <XMarkIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
          </div>
        </button>
        
        {isOpen && (
          <div className="p-4 border-t">
            <FilterContent />
          </div>
        )}
      </div>

      {/* Versión desktop */}
      <div className="hidden md:block p-4">
        <FilterContent />
      </div>
    </div>
  );
};

export default FilterBar;