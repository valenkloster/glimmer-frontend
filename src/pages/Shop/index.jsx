import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import { ShoppingCartContext } from '../../context';
import './styles.css'

function Shop() {
  const { products, loading } = useContext(ShoppingCartContext);
  const context = useContext(ShoppingCartContext);
  const location = useLocation();

  useEffect(() => {
    // Obtener categoryId de los parámetros de la URL
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('category');
    
    if (categoryId && categoryId !== context.selectedCategory) {
      context.setSelectedCategory(Number(categoryId));
    }
  }, [location.search]);

  if (loading) {
    return <div>Cargando productos...</div>; // Muestra un mensaje mientras se cargan los productos
  }

  return (
    <Layout>
      <div className="grid-container grid gap-8 justify-center">
        {products?.map(item => (
          <Card key={item.id_producto} data={item} />
        ))}
      </div>
    </Layout>
  );
}

export default Shop
