import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { httpClient } from '../../services/httpClient';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const status_payment = searchParams.get('status');
        const token = localStorage.getItem('token');
        const id_direccion = localStorage.getItem('selectedAddressId');
        const shippingCost = localStorage.getItem('shippingCost');
        const shippingDate = localStorage.getItem('shippingDate');
        const productsTotal = localStorage.getItem('productsTotal');
      
        if (status_payment === 'approved') {
          await httpClient.post('/api/v1/pagos/create-order', { 
            sub: token, 
            status: status_payment, 
            id_direccion,
            shippingCost: parseFloat(shippingCost),
            productsTotal: parseFloat(productsTotal),
            shippingDate: shippingDate,
          });

          // Limpiamos todos los datos del localStorage
          localStorage.removeItem('selectedAddressId');
          localStorage.removeItem('shippingCost');
          localStorage.removeItem('shippingDate');
          localStorage.removeItem('productsTotal');
          
          const interval = setInterval(() => {
            setCountdown(prev => {
              if (prev === 1) {
                clearInterval(interval);
                window.location.replace('/shop');
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          navigate('/failure');
        }
      } catch (error) {
        console.error('No se pudo procesar el pago. Error: ', error);
        navigate('/failure');
      }
    };
    
    verifyPayment();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-verde-agua" />
        <h1 className="text-3xl sm:text-4xl font-light">¡Gracias por tu compra! ♥</h1>
        <p className="text-base sm:text-lg text-gray-600">Tu pedido ha sido procesado exitosamente.</p>
        <div className="space-y-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-verde-agua"></div>
          </div>
          <p className="text-gray-500">
            Serás redirigido a la tienda en {countdown} segundos...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;