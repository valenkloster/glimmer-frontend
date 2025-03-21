import { useContext, useState, useEffect } from 'react';
import { ShoppingCartContext } from '../../context';
import { FavoritesContext } from '../../context/favorites/FavoritesContext';
import { AuthContext } from '../../context/auth/AuthContext';
import { CartContext } from '../../context/cart/CartContext';
import { ReviewContext } from '../../context/review/reviewContext';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { LoginAlert } from '../LoginAlert';
import AverageRating from '../AverageRating';

const ProductDetail = () => {
  const { productToShow } = useContext(ShoppingCartContext);
  const { addToFavorites, removeFromFavorites, isProductFavorite } = useContext(FavoritesContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart, cart } = useContext(CartContext);
  const { reviews = [] } = useContext(ReviewContext) || {};
  
  const [showFavAlert, setShowFavAlert] = useState(false);
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productToShow) {
      setIsLoading(false);
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
    return () => {
      setIsVisible(false);
      setIsLoading(true);
    };
  }, [productToShow]);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      setShowFavAlert(true);
      setTimeout(() => setShowFavAlert(false), 3000);
      return;
    }

    if (isProductFavorite(productToShow?.id_producto)) {
      await removeFromFavorites(productToShow.id_producto);
    } else {
      await addToFavorites(productToShow.id_producto);
    }
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      setShowCartAlert(true);
      setTimeout(() => setShowCartAlert(false), 3000);
      return;
    }

    if (isAddingToCart || !productToShow?.id_producto) {
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(productToShow.id_producto, 1, productToShow);
    } catch (error) {
      console.error('Error agregando al carrito:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderIcon = () => {
    const isInCart = cart?.detalles?.some(item => 
      item.id_producto === productToShow.id_producto
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
        className={`
          p-3 m-2 border rounded-full transition-all duration-200
          ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : 'hover:border-black'}
        `}
        onClick={handleAddToCart}
        disabled={isAddingToCart || !productToShow || !productToShow.id_producto}
      >
        {isAddingToCart ? 'Agregando...' : 'Agregar al carrito'}
      </button>
    );
  };

  const isFavorite = productToShow?.id_producto ? isProductFavorite(productToShow.id_producto) : false;

  // Mostrar spinner mientras carga
  if (isLoading || !productToShow) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-verde-agua"></div>
      </div>
    );
  }

  // Verificar que todos los datos necesarios estén disponibles
  const isDataComplete = 
    productToShow.nombre &&
    productToShow.marca &&
    productToShow.codigo &&
    productToShow.precio &&
    productToShow.imagen;

  if (!isDataComplete) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-verde-agua"></div>
      </div>
    );
  }

  return (
    <section className={`w-full bg-white py-10 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-20 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Columna de imagen */}
          <div className="w-full h-full bg-gray-50 rounded-lg p-6">
            <img 
              className="w-full h-full object-contain" 
              src={productToShow.imagen} 
              alt={productToShow.nombre} 
              loading="lazy"
            />
          </div>

          {/* Columna de información */}
          <div className="flex flex-col my-8 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                {productToShow.marca}
              </p>
              <p className="text-2xl font-bold text-gray-900 font-product">
                {productToShow.nombre}
              </p>
              <p className="text-xs text-gray-600">
                Item {productToShow.codigo}
              </p>

              {/* Puntuación promedio */}
              <AverageRating reviews={reviews} />

              <p className="text-xl font-semibold font-serif mt-4">
                ${parseFloat(productToShow.precio).toLocaleString('es-AR')}
              </p>
              <p className="text-sm text-gray-600">
                Tamaño: {productToShow.tamanio} g
              </p>
            </div>

            <hr className="my-4" />

            {/* Descripción */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-serif">Resumen</h3>
              <p className="text-gray-600 font-serif">
                {productToShow.descripcion}
              </p>
            </div>

            {/* Botones de acción */}
            <div className="relative flex flex-col items-center">
              {/* Contenedor de alertas */}
              <div className="w-full h-12 relative mb-2">
                {showFavAlert && <LoginAlert text="agregar productos a favoritos" position="relative" />}
                {showCartAlert && <LoginAlert text="agregar productos al carrito" position="relative" />}
              </div>
              
              {/* Botones */}
              <div className="flex items-center justify-around w-full mx-4 md:mx-20">
                {renderIcon()}
                <button 
                  onClick={handleFavoriteClick}
                  className={`p-3 border rounded-full transition-colors duration-300 ${
                    isFavorite 
                      ? 'border-red-500 hover:bg-red-50' 
                      : 'hover:border-black'
                  }`}
                >
                  {isFavorite ? (
                    <HeartSolid className="h-6 w-6 text-red-500"/>
                  ) : (
                    <HeartOutline className="h-6 w-6"/>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;