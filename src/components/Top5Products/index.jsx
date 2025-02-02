import React, { useState, useContext } from 'react';
import { OrderContext } from '../../context/order/OrderContext';
import { BuildingStorefrontIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const TopProducts = () => {
  const { fetchTop5Products, loading } = useContext(OrderContext);
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState('2025');
  const [products, setProducts] = useState([]);
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const topProducts = await fetchTop5Products(month, year);
    console.log('Productos recibidos:', topProducts);
    setProducts(topProducts);
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .product-item {
            opacity: 0;
            animation: fadeInUp 0.5s ease-out forwards;
          }
        `}
      </style>

      <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-3 bg-nude bg-opacity-60 rounded-lg">
        <form onSubmit={handleSubmit} className="w-full max-w-md mb-6 flex flex-wrap gap-3 justify-center">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-1.5 rounded text-sm"
          >
            {months.map((monthName, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                {monthName}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-1.5 rounded text-sm"
          >
            {[2024, 2025, 2026].map(yearNum => (
              <option key={yearNum} value={yearNum}>{yearNum}</option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-verde-agua text-white px-3 py-1.5 rounded text-sm hover:opacity-90 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Mostrar productos'}
          </button>
        </form>

        {products.length > 0 ? (
          <ul className="w-full bg-white shadow-md rounded-lg p-3">
            {products.map((product, index) => (
            <li 
              key={product.productId} 
              className="product-item flex flex-col sm:flex-row items-center gap-3 sm:gap-4 border-b py-4 hover:bg-gray-50 px-3 rounded-lg" 
              style={{ 
                animationDelay: `${index * 150}ms`
              }}
            >
              <span className="text-xl font-bold text-verde-agua w-6">{index + 1}</span>
              <img 
                src={product.image} 
                alt={product.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md hover:scale-105 transition-all duration-300"
              />
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h3 className="font-bold text-base text-gray-800 flex flex-col sm:flex-row items-center gap-2">
                  {product.name}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-verde-agua text-white">
                    Top {index + 1}
                  </span>
                </h3>
                <p className="text-gray-600 text-sm flex items-center gap-1 justify-center sm:justify-start">
                  <BuildingStorefrontIcon className="h-4 w-4"/>
                  {product.brand}
                </p>
                <p className="text-verde-agua font-medium text-sm flex items-center gap-1 justify-center sm:justify-start">
                  <ShoppingCartIcon className="h-4 w-4"/>
                  {product.totalSold} unidades
                </p>
              </div>
            </li>
            ))}
          </ul>
        ) : (
          <div className="w-full text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">No hay productos registrados para el período seleccionado</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TopProducts;