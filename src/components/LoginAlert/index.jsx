import { Link } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export const LoginAlert = () => {
  return (
    <div className="fixed top-20 left-4 w-80 bg-white rounded-lg shadow-lg animate-in duration-500">
      <div className="p-4 flex items-center gap-3">
        <LockClosedIcon className="h-5 w-5 text-verde-agua flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">
            Necesitas iniciar sesión para agregar productos a favoritos
          </p>
          <Link 
            to="/login" 
            className="bg-verde-agua text-white text-center px-4 py-2 rounded-full hover:bg-opacity-90 transition-all text-sm inline-block"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};