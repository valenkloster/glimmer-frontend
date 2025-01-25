import React, { useContext } from 'react';
import { FavoritesContext } from '../../context/favorites/FavoritesContext';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { favorites, loading, error } = useContext(FavoritesContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ marginTop: '81px' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-verde-agua"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ marginTop: '81px' }}>
        <p className="text-xl text-gray-600 font-light">{error}</p>
        <Link 
          to="/shop" 
          className="bg-verde-agua text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all inline-block hover:transform hover:scale-105 duration-300"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const favoriteProducts = favorites;

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      {/* Header Section */}
      <section className="bg-nude py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-light mb-4 text-center">
            Mis Favoritos
          </h1>
          <p className="text-gray-600 text-center text-lg font-light">
            Tu colección personal de productos seleccionados
          </p>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-16">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 mx-auto mb-6 text-gray-400"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <h2 className="text-2xl font-light mb-4">
                No tienes productos favoritos aún
              </h2>
              <p className="text-gray-600 mb-8 font-light">
                Explora nuestra tienda y guarda tus productos favoritos
              </p>
              <Link 
                to="/shop" 
                className="bg-verde-agua text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all inline-block hover:transform hover:scale-105 duration-300"
              >
                Explorar productos
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              {favoriteProducts.map((favorite) => (
                <div 
                  key={favorite.id_favoritos}
                  className="w-64 transform transition-all duration-500 hover:scale-105"
                >
                  <Card data={favorite.producto} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FavoritesPage;