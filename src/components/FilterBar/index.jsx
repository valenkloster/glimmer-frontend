import React, { useState, useRef, useEffect } from 'react';
import { useContext } from 'react';
import { ShoppingCartContext } from '../../context';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const FilterBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const minInputRef = useRef(null);
  const maxInputRef = useRef(null);
  
  const { 
    setPriceRange, 
    setSortOrder,
    priceRange,
    sortOrder
  } = useContext(ShoppingCartContext);

  // Actualizar los inputs cuando priceRange cambia
  useEffect(() => {
    if (minInputRef.current) minInputRef.current.value = priceRange.min;
    if (maxInputRef.current) maxInputRef.current.value = priceRange.max;
  }, [priceRange]);

  const handlePriceSubmit = (type) => (e) => {
    if (e.key === 'Enter') {
      const value = type === 'min' ? minInputRef.current.value : maxInputRef.current.value;
      setPriceRange(prev => ({
        ...prev,
        [type]: value === '' ? '' : Number(value)
      }));
      // Mantener el foco en el input actual
      e.target.blur();
      e.target.focus();
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    if (minInputRef.current) minInputRef.current.value = '';
    if (maxInputRef.current) maxInputRef.current.value = '';
    setSortOrder('');
  };

  const FilterContent = () => (
    <div className="flex flex-col md:flex-row justify-center md:items-center gap-4">
      {/* Filtro de precio */}
      <div className="flex items-center gap-2">
        <span className="font-product font-medium whitespace-nowrap">Precio:</span>
        <input
          type="number"
          placeholder="Mínimo"
          className="w-full md:w-24 p-2 border rounded"
          ref={minInputRef}
          defaultValue={priceRange.min}
          onKeyDown={handlePriceSubmit('min')}
          onWheel={(e) => e.target.blur()}
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Máximo"
          className="w-full md:w-24 p-2 border rounded"
          ref={maxInputRef}
          defaultValue={priceRange.max}
          onKeyDown={handlePriceSubmit('max')}
          onWheel={(e) => e.target.blur()}
        />
      </div>

      {/* Ordenamiento */}
      <div className="flex items-center gap-2">
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

      {/* Botón para limpiar filtros */}
      {(priceRange.min || priceRange.max || sortOrder) && (
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 whitespace-nowrap"
        >
          Limpiar filtros
        </button>
      )}
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
          {isOpen ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <span className="text-sm text-gray-500">
              {(priceRange.min || priceRange.max || sortOrder) ? 'Filtros activos' : 'Sin filtros'}
            </span>
          )}
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