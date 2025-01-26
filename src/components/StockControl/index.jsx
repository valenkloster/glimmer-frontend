import React, { useContext, useEffect, useState } from 'react';
import { ShoppingCartContext } from '../../context';

function StockControl() {
    const { lowStockProducts, loadLowStockProducts, updateProductStock } = useContext(ShoppingCartContext);
    const [inputValues, setInputValues] = useState({});
   
    useEffect(() => {
      loadLowStockProducts();
    }, []);

    const handleUpdateStock = (productId, value) => {
      updateProductStock(productId, value);
      setInputValues(prev => ({ ...prev, [productId]: '' }));
    };
   
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {lowStockProducts.map((product) => (
          <div key={product.id_producto} className="flex bg-verde-agua/10 flex-col items-center p-4 border rounded-lg shadow-lg h-full">
            <div className="flex-grow flex flex-col items-center">
              <img src={product.imagen} alt={product.nombre} className="w-32 h-32 object-cover mb-2"/>
              <p className="text-sm font-medium text-center mb-1 min-h-[2.5rem] line-clamp-2">{product.nombre}</p>
              <p className="text-xs text-gray-600 mb-1">Código: {product.codigo}</p>
              <p className="text-xs text-gray-600 mb-2">{product.marca}</p>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold mb-2
                ${product.stock < 11
                  ? 'border-2 border-red-500 bg-red-100'
                  : product.stock < 26
                  ? 'border-2 border-yellow-500 bg-yellow-100'
                  : 'border-2 border-green-500 bg-green-100'}`}>
                {product.stock}
              </div>
            </div>
            <div className="flex flex-col w-full items-center gap-2">
              <input
                type="number"
                min="0"
                className="border rounded p-2 w-full text-center"
                placeholder="Ingrese cantidad a reponer"
                value={inputValues[product.id_producto] || ''}
                onChange={(e) => setInputValues(prev => ({
                  ...prev,
                  [product.id_producto]: e.target.value
                }))}
              />
              <button 
                className="bg-verde-agua text-white rounded py-2 px-4 w-full hover:bg-verde-agua/70"
                onClick={() => handleUpdateStock(product.id_producto, inputValues[product.id_producto])}
              >
                Agregar Stock
              </button>
            </div>
          </div>
        ))}
      </div>
    );
}

export default StockControl;