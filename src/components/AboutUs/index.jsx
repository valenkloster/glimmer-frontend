import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartContext } from '../../context';

const AboutUs = () => {
    const navigate = useNavigate();
    const { clearSelectedCategory } = useContext(ShoppingCartContext);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    const images = [
        '/bg-about-us.jpg',
        '/our_mision.jpg'
    ];

    useEffect(() => {
        let loadedImages = 0;
        const totalImages = images.length;

        const preloadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    loadedImages += 1;
                    if (loadedImages === totalImages) {
                        setImagesLoaded(true);
                    }
                    resolve();
                };
                img.onerror = reject;
            });
        };

        const preloadAllImages = async () => {
            try {
                await Promise.all(images.map(src => preloadImage(src)));
            } catch (error) {
                console.error('Error preloading images:', error);
                setImagesLoaded(true);
            }
        };

        preloadAllImages();
    }, []);

    useEffect(() => {
        if (imagesLoaded) {
            setIsVisible(true);
        }
    }, [imagesLoaded]);
    
    const handleExploreClick = () => {
        window.scrollTo(0,0);
        clearSelectedCategory();
        navigate('/shop');
    };

  return (
    <div className="w-full pt-[81px]">
      {/* Hero Section */}
      <section className={`relative h-[60vh] bg-[#F5F2ED] flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 overflow-hidden">
            {/* Loading Spinner */}
            {!imagesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5EA692]"></div>
                </div>
            )}
            <img
                src="/bg-about-us.jpg"
                alt="Skincare products"
                className={`w-full h-full object-cover opacity-20 transition-opacity duration-500 ${imagesLoaded ? 'opacity-20' : 'opacity-0'}`}
            />
        </div>
        <div className="relative z-[1] text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light mb-6">
            Hacemos que el cuidado de tu piel sea simple
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-700">
            Importamos los mejores productos de skincare para que puedas cuidar tu piel sin complicaciones
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className={`py-20 bg-white transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl mb-6 font-light">Nuestra Misión</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nacimos con el propósito de simplificar el acceso a productos de skincare de alta calidad en Argentina. Entendemos que el proceso de importación puede ser complejo y costoso, por eso nos encargamos de todo el proceso para que vos solo te preocupes por cuidar tu piel.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Seleccionamos cuidadosamente cada producto, asegurándonos de que cumpla con los más altos estándares de calidad y efectividad. Trabajamos directamente con marcas reconocidas internacionalmente para garantizar la autenticidad de cada producto.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                  {!imagesLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5EA692]"></div>
                    </div>
                  )}
                  <img
                    src="/our_mision.jpg"
                    alt="Our mission"
                    className={`w-full h-full object-cover transform transition-all duration-500 ${
                      imagesLoaded ? 'opacity-100 hover:scale-105' : 'opacity-0'
                    }`}
                  />
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Values */}
      <section className={`py-20 bg-[#F5F2ED] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl mb-12 text-center font-light">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Calidad",
                description: "Solo trabajamos con productos certificados y de marcas reconocidas internacionalmente",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                )
              },
              {
                title: "Transparencia",
                description: "Información clara sobre productos, precios y procesos de importación",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                )
              },
              {
                title: "Compromiso",
                description: "Nos dedicamos a hacer que tu experiencia de compra sea simple y satisfactoria",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                )
              }
            ].map((value, index) => (
              <div 
                key={value.title}
                className="bg-white p-8 rounded-lg text-center transform transition-all duration-500 hover:scale-105 hover:shadow-lg"
              >
                {value.icon}
                <h3 className="text-xl mb-4 font-light">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`py-20 bg-white transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl mb-12 text-center font-light">¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Productos Garantizados",
                description: "Todos nuestros productos son 100% originales y cuentan con garantía de autenticidad."
              },
              {
                title: "Envío Seguro",
                description: "Nos encargamos de todo el proceso de importación y entrega hasta la puerta de tu casa."
              },
              {
                title: "Asesoramiento Personalizado",
                description: "Te ayudamos a elegir los productos ideales para tu tipo de piel y necesidades específicas."
              },
              {
                title: "Precios Transparentes",
                description: "Sin costos ocultos. El precio que ves incluye todos los gastos de importación."
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="p-6 border border-gray-100 rounded-lg transform transition-all duration-500 hover:shadow-lg hover:border-[#5EA692]"
              >
                <h3 className="text-xl mb-4 font-light">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-20 bg-[#5EA692] text-white transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl mb-6 font-light">Comenzá tu rutina de skincare hoy</h2>
          <p className="text-xl mb-8 font-light">
            Descubrí nuestra selección de productos y transformá el cuidado de tu piel
          </p>
          <button 
            onClick={handleExploreClick}
            className="bg-white text-[#5EA692] px-8 py-3 rounded-full hover:bg-opacity-90 transition-all inline-block hover:transform hover:scale-105 duration-300"
          >
              Explorar productos
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;