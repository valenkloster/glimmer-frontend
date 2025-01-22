import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCartContext } from '../../context';
import { productService } from '../../services/productService';
import ProductDetail from '../../components/ProductDetail';
import Reviews from '../../components/Reviews';

const ProductPage = () => {
  const { id } = useParams();
  const context = useContext(ShoppingCartContext);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await productService.getById(id);
        context.setProductToShow(response.body);
      } catch (error) {
        console.error('Error loading product:', error);
      }
    };

    if (id) {
      loadProduct();
    }

    // Limpiar el producto al desmontar
    return () => {
      context.setProductToShow(null);
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-white" style={{ marginTop: '81px' }}>
      <ProductDetail />
      <div className="max-w-7xl mx-auto px-4 md:px-20">
        <Reviews productId={id} />
      </div>
    </div>
  );
};

export default ProductPage;