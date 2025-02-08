import React, { useContext, useEffect, useState } from 'react';
import { ShoppingCartContext } from '../../context';
import { PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

function StockControl() {
    const { lowStockProducts, loadLowStockProducts, updateProductStock } = useContext(ShoppingCartContext);
    const [inputValues, setInputValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showProducts, setShowProducts] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
   
    useEffect(() => {
      const loadProducts = async () => {
        await loadLowStockProducts();
        setLoading(false);
        // Pequeño delay antes de mostrar cualquier contenido
        setTimeout(() => {
          setInitialLoad(false);
          // Delay adicional para la animación de los productos
          setTimeout(() => setShowProducts(true), 100);
        }, 100);
      };
      loadProducts();
    }, []);

    const handleUpdateStock = async (productId, value, productName) => {
      if (!value || isNaN(value) || value <= 0) return;
      
      setUpdating(productId);
      await updateProductStock(productId, value);
      setInputValues(prev => ({ ...prev, [productId]: '' }));
      setUpdating(null);
      
      setSuccessMessage(`Stock actualizado: ${productName}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleIncrement = (productId) => {
      const currentValue = parseInt(inputValues[productId] || 0);
      setInputValues(prev => ({
        ...prev,
        [productId]: (currentValue + 1).toString()
      }));
    };

    const handleDecrement = (productId) => {
      const currentValue = parseInt(inputValues[productId] || 0);
      if (currentValue > 0) {
        setInputValues(prev => ({
          ...prev,
          [productId]: (currentValue - 1).toString()
        }));
      }
    };

    const getStockStatusColor = (stock) => {
      if (stock < 11) return 'border-red-500 bg-red-100 text-red-700';
      if (stock < 26) return 'border-yellow-500 bg-yellow-100 text-yellow-700';
      return 'border-green-500 bg-green-100 text-green-700';
    };

    // Si está en la carga inicial, no mostrar nada
    if (initialLoad) {
      return null;
    }

    // Skeleton loader solo se muestra después de la carga inicial
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse bg-white rounded-xl shadow-md p-6 h-[400px]">
              <div className="w-40 h-40 bg-gray-200 rounded-lg mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Mensaje de éxito global */}
        <div className={`fixed top-4 right-4 z-50 transition-all duration-500 ${
          successMessage 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {lowStockProducts.map((product, index) => (
            <div 
              key={product.id_producto}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
              className={`group flex bg-white flex-col items-center p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-700 
                ${showProducts 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'}`}
            >
              <div className="flex-grow flex flex-col items-center w-full">
                <div className="relative w-40 h-40 mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={product.imagen} 
                    alt={product.nombre} 
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <h3 className="text-base font-medium text-center mb-2 min-h-[2.5rem] line-clamp-2">
                  {product.nombre}
                </h3>
                
                <div className="flex flex-col sm:flex-row items-center gap-2 mb-2 text-center sm:text-left">
                  <span className="text-sm text-gray-600">Código: {product.codigo}</span>
                  <span className="hidden sm:block text-sm text-gray-400">|</span>
                  <span className="text-sm text-gray-600">{product.marca}</span>
                </div>

                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold mb-4 border-2 transition-colors duration-300
                  ${getStockStatusColor(product.stock)}`}>
                  {product.stock}
                </div>
              </div>

              <div className="flex flex-col w-full items-center gap-3 mt-2">
                <div className="flex items-center w-full">
                  <button 
                    onClick={() => handleDecrement(product.id_producto)}
                    className="p-2 rounded-l border border-r-0 bg-verde-agua hover:bg-verde-agua/80 active:bg-gray-100 transition-colors"
                  >
                    <MinusIcon className="w-4 h-4 text-white" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    className="border-y p-2 w-full text-center focus:outline-none focus:ring-1 focus:ring-verde-agua focus:border-verde-agua transition-colors"
                    placeholder="Cantidad"
                    value={inputValues[product.id_producto] || ''}
                    onChange={(e) => setInputValues(prev => ({
                      ...prev,
                      [product.id_producto]: e.target.value
                    }))}
                  />
                  <button 
                    onClick={() => handleIncrement(product.id_producto)}
                    className="p-2 rounded-r border border-l-0 bg-verde-agua hover:bg-verde-agua/80 active:bg-gray-100 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 text-white" />
                  </button>
                </div>

                <button 
                  className={`relative w-full py-2.5 px-4 rounded-lg font-medium transform transition-all duration-300
                    ${updating === product.id_producto
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-verde-agua text-white hover:bg-verde-agua/90 active:scale-95'
                    }`}
                  onClick={() => handleUpdateStock(product.id_producto, inputValues[product.id_producto], product.nombre)}
                  disabled={updating === product.id_producto}
                >
                  {updating === product.id_producto ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Actualizando...
                    </div>
                  ) : 'Agregar Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

export default StockControl;