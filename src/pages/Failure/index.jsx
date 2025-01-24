import { useNavigate } from 'react-router-dom';
import { XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const FailurePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <XCircleIcon className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-red-500" />
        <h1 className="text-3xl sm:text-4xl font-light">
          Hubo un problema con tu pago
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Lo sentimos, no pudimos procesar tu pago. 
          Por favor, intenta nuevamente más tarde.
        </p>
        <button 
          onClick={() => navigate('/shop')}
          className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-medium rounded-full text-white bg-verde-agua hover:bg-opacity-90 transition-all transform hover:scale-105"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver a la tienda
        </button>
      </div>
    </div>
  );
};


export default FailurePage;