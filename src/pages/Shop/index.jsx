import { useContext } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import { ShoppingCartContext } from '../../context';

function Shop() {
  const { products, loading } = useContext(ShoppingCartContext);

  if (loading) {
    return <div>Cargando productos...</div>; // Muestra un mensaje mientras se cargan los productos
  }

  return (
    <Layout>
      <div className="grid gap-10 grid-cols-4 w-full max-w-screen-xl">
        {products?.map(item => (
          <Card key={item.id} data={item} />
        ))}
      </div>
    </Layout>
  );
}

export default Shop;
