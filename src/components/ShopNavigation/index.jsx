import React, { useState, useContext } from 'react';
import { ShoppingCartContext } from '../../context';

const ShopNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { categories, setSelectedCategory } = useContext(ShoppingCartContext);

  // Obtener solo las categorías padre
  const parentCategories = categories.filter(cat => !cat.id_categoria_padre);

  return (
    <div className="relative group">
      <button 
        className="px-4 py-2 font-medium"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => {
          setSelectedCategory(null);
          setIsOpen(false);
        }}
      >
        SHOP
      </button>
      
      {isOpen && (
        <div 
          className="absolute left-0 mt-1 w-48 bg-white shadow-lg rounded-md py-2 z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {parentCategories.map(parentCat => (
            <div key={parentCat.id_categoria} className="relative group/item">
              <button
                onClick={() => {
                  setSelectedCategory(parentCat.id_categoria);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {parentCat.nombre}
              </button>
              
              <div className="absolute left-full top-0 w-48 bg-white shadow-lg rounded-md py-2 hidden group-hover/item:block">
                {parentCat.subcategorias.map(childCat => (
                  <button
                    key={childCat.id_categoria}
                    onClick={() => {
                      setSelectedCategory(childCat.id_categoria);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {childCat.nombre}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopNavigation;