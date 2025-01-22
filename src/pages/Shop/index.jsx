import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../../components/Card';
import { ShoppingCartContext } from '../../context';

function Shop() {
  const context = useContext(ShoppingCartContext);
  const { filteredProducts, loading } = context;
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('category');
    
    if (categoryId && categoryId !== context.selectedCategory) {
      context.setSelectedCategory(Number(categoryId));
    }
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ marginTop: '81px' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-verde-agua"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ marginTop: '81px' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-8">
          {filteredProducts?.map(item => (
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