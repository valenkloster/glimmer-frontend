import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartContext } from '../../context';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const navigate = useNavigate();
  const { setSelectedCategory, clearSelectedCategory } = useContext(ShoppingCartContext);

  const collageStructure = [
    { 
      className: 'col-span-full row-span-full md:col-span-2 md:row-span-2', 
      image: '/product_green.jpg' 
    },
    { 
      className: 'col-span-1 hidden md:block', 
      image: '/person2.jpg' 
    },
    { 
      className: 'col-span-1 hidden md:block', 
      image: '/product2.jpg' 
    },
    { 
      className: 'col-span-1 hidden md:block', 
      image: '/person1.jpg' 
    },
    { 
      className: 'col-span-1 hidden md:block', 
      image: '/products.jpg' 
    }
  ];

  useEffect(() => {
    let loadedImages = 0;
    const totalImages = collageStructure.length;

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
        img.onerror = () => {
          loadedImages += 1;
          if (loadedImages === totalImages) {
            setImagesLoaded(true);
          }
          resolve(); // Resolvemos incluso con error para no bloquear la carga
        };
      });
    };

    const preloadAllImages = async () => {
      try {
        await Promise.all(collageStructure.map(item => preloadImage(item.image)));
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
    window.scrollTo(0, 0)
    clearSelectedCategory();
    navigate('/shop');
  };

  const handleCategoryClick = (categoryId) => {
    window.scrollTo(0, 0)
    setSelectedCategory(categoryId);
    navigate('/shop');
  };

  const carouselItems = [
    {
      title: "Descubre tu rutina ideal",
      description: "Tu piel es única y merece un cuidado personalizado. Descubre la combinación perfecta de productos que transformarán tu piel y te harán lucir radiante todos los días.",
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800"
    },
    {
      title: "Cuida tu piel",
      description: "La constancia es la clave para una piel saludable. Encuentra los productos que tu piel necesita para mantener su balance y vitalidad natural.",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800"
    },
    {
      title: "Belleza natural",
      description: "Resalta tu belleza natural con productos que realmente funcionan. Ingredientes de calidad que nutren tu piel y realzan tu belleza única.",
      image: "https://images.unsplash.com/photo-1619451427882-6aaaded0cc61?w=800"
    }
  ];
  

  const categories = [
    {
      id_categoria: 1,
      name: 'Limpieza',
      image: 'https://images.unsplash.com/photo-1631390573311-3bb5329df0d3?w=800',
      description: 'Limpiadores faciales, desmaquillantes y exfoliantes'
    },
    {
      id_categoria: 5,
      name: 'Hidratación y Cuidado Facial',
      image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800',
      description: 'Cremas hidratantes, de noche y aceites faciales'
    },
    {
      id_categoria: 9,
      name: 'Cuidado de Ojos',
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
      description: 'Cremas y sérums especializados para el contorno de ojos'
    },
    {
      id_categoria: 12,
      name: 'Protección Solar',
      image: 'https://images.unsplash.com/photo-1633423412046-b0724b8caedf?w=800',
      description: 'Protectores solares faciales de alta calidad'
    },
    {
      id_categoria: 14,
      name: 'Cuidado de Labios',
      image: 'https://images.unsplash.com/photo-1638404431939-3943201c8a86?w=800',
      description: 'Bálsamos y exfoliantes labiales'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section with Collage */}
      <section 
        className={`relative transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          height: 'calc(100vh - 81px)',
          marginTop: '81px'
        }}
      >
        <div className="absolute inset-0">
          <div className={`grid grid-cols-3 grid-rows-2 gap-2 h-full ${!imagesLoaded ? 'invisible' : ''}`}>
            {collageStructure.map((item, index) => (
              <div 
                key={index} 
                className={`${item.className} overflow-hidden group relative`}
              >
                <img
                  src={item.image}
                  alt={`Collage ${index + 1}`}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-700" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/50" />
        </div>

        {/* Loading Spinner */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-verde-agua"></div>
          </div>
        )}

        <div className={`relative h-full flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-6xl font-light mb-6 text-white drop-shadow-lg">
              Tu piel merece lo mejor
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light text-white drop-shadow-md">
              Encuentra los productos perfectos para tu rutina de skincare
            </p>
            <button 
              onClick={handleExploreClick}
              className="bg-verde-agua text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all inline-block hover:transform hover:scale-105 duration-300"
            >
              Explorar productos
            </button>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl mb-12 text-center font-light transform transition-all duration-500 hover:translate-y-[-5px]">
            Categorías
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <button 
                key={category.id_categoria}
                onClick={() => handleCategoryClick(category.id_categoria)}
                className="relative group cursor-pointer overflow-hidden rounded-lg transform transition-all duration-500 hover:scale-105 hover:z-10"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-light">{category.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-24 bg-nude">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselItems.map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                      <div className="order-2 md:order-1 p-8">
                        <h2 className="text-4xl mb-6 font-light">{item.title}</h2>
                        <p className="text-lg leading-relaxed text-gray-600">{item.description}</p>
                      </div>
                      <div className="order-1 md:order-2">
                        <div className="aspect-w-4 aspect-h-5 rounded-lg overflow-hidden max-w-md mx-auto">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 bg-white rounded-full shadow-lg hover:bg-verde-agua hover:text-white transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 bg-white rounded-full shadow-lg hover:bg-verde-agua hover:text-white transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Skincare Tips Section with Fade In */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl mb-12 text-center font-light">
            El cuidado de la piel es importante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Rutina diaria",
                desc: "La constancia es clave para mantener una piel saludable",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                )
              },
              {
                title: "Productos adecuados",
                desc: "Cada tipo de piel necesita cuidados específicos",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                )
              },
              {
                title: "Protección solar",
                desc: "El paso más importante en el cuidado de la piel",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                )
              }
            ].map((tip, index) => (
              <div 
                key={tip.title} 
                className="text-center p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-lg rounded-xl"
              >
                {tip.icon}
                <h3 className="text-xl mb-4 font-light">{tip.title}</h3>
                <p className="text-gray-600">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;