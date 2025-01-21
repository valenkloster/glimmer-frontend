import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCartContext } from '../../context';
import { HeartIcon } from '@heroicons/react/24/outline';
import { productService } from '../../services';
import ReviewSection from '../ProductReviews';

const ProductDetail = () => {
  const { id } = useParams(); // Obtener el ID de la URL
  const context = useContext(ShoppingCartContext);
  const { productToShow } = context;

  // Cargar el producto cuando cambie el ID de la URL
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
  }, [id]);

  const renderIcon = (id_producto) => {
    const isInCart = context.cartProducts.filter(product => 
      product.id_producto === id_producto
    ).length > 0;

    if (isInCart) {
      return (
        <div className="p-3 m-2 border rounded-full bg-gray-400 opacity-60 text-black">
          Producto agregado
        </div>
      )
    } else {
      return (
        <button 
          className="p-3 m-2 border rounded-full hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={productToShow?.stock <= 0}
          onClick={(event) => context.addProductToCart(event, productToShow)}>
          {productToShow?.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      )
    }
  }

  return (
    <section className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-20 py-8">
       <div className="grid md:grid-cols-2 gap-8">
          <div className="w-full h-full bg-gray-50 rounded-lg p-6">
            <img 
              className='w-full h-full object-contain' 
              src={productToShow?.imagen} 
              alt={productToShow?.nombre} 
              loading="lazy"
            />
          </div>
          <div className="flex flex-col my-8 space-y-2">
              <p className="text-sm text-gray-500">
                {productToShow?.marca}
              </p>
              <p className="text-2xl font-bold text-gray-900 font-product">
                {productToShow?.nombre}
              </p>
              <p className="text-xs text-gray-600">
                Item {productToShow?.codigo}
              </p>
              <p className="text-xl font-semibold font-serif">
                ${productToShow?.precio}
              </p>
              <p className="text-sm text-gray-600">
                Tamaño: {productToShow?.tamanio}
              </p>
              <hr />
              <h3 className='text-xl text-bold font-serif'>Resumen</h3>
              <p className="text-gray-600 font-serif">
                  {productToShow?.descripcion}
              </p>
              <div className='flex items-center justify-around mx-20'>
                {renderIcon(productToShow?.id_producto)}
                <button 
                  className="p-3 border rounded-full hover:border-black">
                  <HeartIcon className='h-6 w-6'></HeartIcon>
                </button>
              </div>
          </div>
          </div>
        </div>
    </section>
  );
};

export default ProductDetail;