import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCartContext } from '../../context';
import { FavoritesContext } from '../../context/favorites/FavoritesContext';
import { AuthContext } from '../../context/auth/AuthContext';
import { CartContext } from '../../context/cart/CartContext';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { productService } from '../../services';
import { LoginAlert } from '../LoginAlert';

const ProductDetail = () => {
  const { id } = useParams();
  const context = useContext(ShoppingCartContext);
  const { addToFavorites, removeFromFavorites, isProductFavorite } = useContext(FavoritesContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart, cart } = useContext(CartContext);
  const { productToShow } = context;
  const [showFavAlert, setShowFavAlert] = useState(false);
  const [showCartAlert, setShowCartAlert] = useState(false);
  
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

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      setShowFavAlert(true);
      setTimeout(() => setShowFavAlert(false), 3000);
      return;
    }

    if (isProductFavorite(productToShow?.id_producto)) {
      removeFromFavorites(productToShow.id_producto);
    } else {
      addToFavorites(productToShow.id_producto);
    }
  };

  const renderIcon = (id_producto) => {
    const isInCart = cart?.detalles?.some(item => 
      item.id_producto === id_producto
    );

    if (productToShow?.stock <= 0) {
      return (
        <div className="p-3 m-2 border rounded-full bg-gray-400 opacity-60 text-black">
          Sin stock
        </div>
      );
    }

    if (isInCart) {
      return (
        <div className="p-3 m-2 border rounded-full bg-gray-400 opacity-60 text-black">
          Producto agregado
        </div>
      );
    }

    return (
      <button 
        className="p-3 m-2 border rounded-full hover:border-black"
        onClick={(event) => {
          event.stopPropagation();
          if (!isAuthenticated) {
            setShowCartAlert(true);
            setTimeout(() => setShowCartAlert(false), 3000);
            return;
          }
          addToCart(productToShow.id_producto, 1);
        }}>
        Agregar al carrito
      </button>
    );
  };

  const isFavorite = productToShow?.id_producto ? isProductFavorite(productToShow.id_producto) : false;

  return (
    <section className="w-full min-h-screen bg-white">
      {showFavAlert && <LoginAlert text="agregar productos a favoritos" />}
      {showCartAlert && <LoginAlert text="agregar productos al carrito" />}
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
                onClick={handleFavoriteClick}
                className={`p-3 border rounded-full transition-colors duration-300 ${
                  isFavorite 
                    ? 'border-red-500 hover:bg-red-50' 
                    : 'hover:border-black'
                }`}
              >
                {isFavorite ? (
                  <HeartSolid className='h-6 w-6 text-red-500'/>
                ) : (
                  <HeartOutline className='h-6 w-6'/>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;