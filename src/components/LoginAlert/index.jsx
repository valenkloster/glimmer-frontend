import { Link } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export const LoginAlert = ({ text, position = 'fixed' }) => {
  const positionClasses = {
    fixed: 'fixed top-20 right-0',
    relative: 'absolute top-0 left-1/2 -translate-x-1/2 z-10'
  };

  return (
    <div className={`${positionClasses[position]} w-72 bg-white rounded-lg shadow-lg animate-in duration-500`}>
      <div className="p-3 flex items-center gap-3">
        <LockClosedIcon className="h-5 w-5 text-verde-agua flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">
            {text.includes("hayas comprado") 
              ? "Para garantizar reseñas confiables, solo habilitamos comentarios de compradores verificados"
              : `Necesitas iniciar sesión para ${text}`
            }
          </p>
          {!text.includes("hayas comprado") && (
            <Link 
              to="/login" 
              className="bg-verde-agua text-white text-center px-4 py-2 rounded-full hover:bg-opacity-90 transition-all text-sm inline-block"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};