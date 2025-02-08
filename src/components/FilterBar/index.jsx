import React, { useState, useRef, useEffect } from 'react';
import { useContext } from 'react';
import { ShoppingCartContext } from '../../context';
import { FunnelIcon, XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const FilterBar = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
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

  const validateAndSetPriceRange = () => {
    const minValue = minInputRef.current?.value || '';
    const maxValue = maxInputRef.current?.value || '';
    
    setError({ min: '', max: '' });
    
    if (minValue !== '' && Number(minValue) <= 0) {
      setError(prev => ({
        ...prev,
        min: 'Ingrese un número positivo'
      }));
      return false;
    }
    
    if (maxValue !== '' && Number(maxValue) <= 0) {
      setError(prev => ({
        ...prev,
        max: 'Ingrese un número positivo'
      }));
      return false;
    }

    if (minValue !== '' && maxValue !== '' && Number(minValue) > Number(maxValue)) {
      setError({
        min: 'El mínimo no puede ser mayor al máximo',
        max: 'El máximo no puede ser menor al mínimo'
      });
      return false;
    }

    const newPriceRange = {
      min: minValue === '' ? '' : Number(minValue),
      max: maxValue === '' ? '' : Number(maxValue)
    };

    setPriceRange(newPriceRange);
    return true;
  };

  const handlePriceKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (validateAndSetPriceRange()) {
        setIsFiltersOpen(false);
      }
      e.target.blur();
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setIsFiltersOpen(false);
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    if (minInputRef.current) minInputRef.current.value = '';
    if (maxInputRef.current) maxInputRef.current.value = '';
    setSortOrder('');
    setError({ min: '', max: '' });
    setIsFiltersOpen(false);
  };

  return (
    <div className="bg-nude shadow-md rounded-lg mb-6">
      {/* Desktop Filters */}
      <div className="hidden md:block p-4">
        <div className="flex justify-center items-center gap-4">
          {/* Price Filter */}
          <div className="flex items-center gap-2">
            <span className="font-product font-medium">Precio:</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="number"
                  placeholder="Mínimo"
                  className={`w-24 p-2 border rounded ${error.min ? 'border-red-500' : ''}`}
                  ref={minInputRef}
                  defaultValue={priceRange.min}
                  onKeyDown={handlePriceKeyDown}
                  onWheel={(e) => e.target.blur()}
                />
                {error.min && (
                  <div className="absolute -bottom-6 left-0 bg-red-100 text-red-500 text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    {error.min}
                  </div>
                )}
              </div>
              <span>-</span>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Máximo"
                  className={`w-24 p-2 border rounded ${error.max ? 'border-red-500' : ''}`}
                  ref={maxInputRef}
                  defaultValue={priceRange.max}
                  onKeyDown={handlePriceKeyDown}
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

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <span className="font-product font-medium">Ordenar por:</span>
            <select
              className="w-60 p-2 border rounded"
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={validateAndSetPriceRange}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-verde-agua hover:bg-verde-agua/80 text-white rounded-lg"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>Buscar</span>
            </button>

            {(priceRange.min || priceRange.max || sortOrder) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="block md:hidden">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="w-full p-4 flex items-center justify-between"
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
            {isFiltersOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </div>
        </button>

        {isFiltersOpen && (
          <div className="p-4 border-t space-y-4">
            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Rango de precio</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    className={`w-full p-2 border rounded ${error.min ? 'border-red-500' : ''}`}
                    ref={minInputRef}
                    defaultValue={priceRange.min}
                    onKeyDown={handlePriceKeyDown}
                    onWheel={(e) => e.target.blur()}
                  />
                  {error.min && (
                    <p className="mt-1 text-xs text-red-500">{error.min}</p>
                  )}
                </div>
                <span className="self-center">-</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Máximo"
                    className={`w-full p-2 border rounded ${error.max ? 'border-red-500' : ''}`}
                    ref={maxInputRef}
                    defaultValue={priceRange.max}
                    onKeyDown={handlePriceKeyDown}
                    onWheel={(e) => e.target.blur()}
                  />
                  {error.max && (
                    <p className="mt-1 text-xs text-red-500">{error.max}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Ordenar por</label>
              <select
                className="w-full p-2 border rounded"
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

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  if (validateAndSetPriceRange()) {
                    setIsFiltersOpen(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-verde-agua hover:bg-verde-agua/80 text-white rounded-lg"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                <span>Aplicar filtros</span>
              </button>

              {(priceRange.min || priceRange.max || sortOrder) && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;