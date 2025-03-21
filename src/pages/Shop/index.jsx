import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../../components/Card';
import { ShoppingCartContext } from '../../context';
import FilterBar from '../../components/FilterBar';

function Shop() {
  const context = useContext(ShoppingCartContext);
  const { 
    filteredProducts, 
    products, 
    loading,
    setPriceRange,
    setSortOrder,
    priceRange
  } = context;
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('category');
    const searchQuery = params.get('search');
    
    if (categoryId && categoryId !== context.selectedCategory) {
      context.setSelectedCategory(Number(categoryId));
    }

    // Limpiar filtros cuando cambia la categoría
    setPriceRange({ min: '', max: '' });
    setSortOrder('');
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[80px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-verde-agua"></div>
      </div>
    );
  }

  const showNoResults = location.search.includes('search') && filteredProducts.length === 0;
  const showNoPriceRangeResults = !showNoResults && filteredProducts.length === 0 && (priceRange.min || priceRange.max);

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .page-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }

          .product-fade-in {
            opacity: 0;
            animation: fadeSlideUp 0.5s ease-out forwards;
          }
        `}
      </style>
      <div className="min-h-screen bg-white pt-[80px] page-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <FilterBar />
          
          {showNoResults && (
            <div className="text-center mb-8 page-fade-in">
              <p className="text-gray-600 mb-4">No hemos encontrado productos con esas características.</p>
              <p className="text-gray-600">Puedes ver otros productos disponibles:</p>
            </div>
          )}

          {showNoPriceRangeResults && (
            <div className="w-full text-center py-3 px-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg mb-8 page-fade-in">
              No hay productos disponibles en el rango de precios seleccionado.
              <button 
                onClick={() => setPriceRange({ min: '', max: '' })}
                className="ml-2 text-amber-900 underline hover:no-underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-8">
            {(showNoResults ? products : filteredProducts)?.map((item, index) => (
              <div 
                key={item.id_producto}
                className="w-64 transform transition-all duration-500 hover:scale-105 product-fade-in"
                style={{ 
                  animationDelay: `${index * 100}ms` 
                }}
              >
                <Card data={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;