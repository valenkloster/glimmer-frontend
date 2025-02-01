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
    setSortOrder
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

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <FilterBar />
        {showNoResults && (
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">No hemos encontrado productos con esas características.</p>
            <p className="text-gray-600">Puedes ver otros productos disponibles:</p>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-8">
          {(showNoResults ? products : filteredProducts)?.map(item => (
            <div 
              key={item.id_producto}
              className="w-64 transform transition-all duration-500 hover:scale-105"
            >
              <Card data={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;