import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await authService.resetPassword(token, formData.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 w-full flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-1/2 bg-[#5EA692] relative overflow-hidden justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5EA692]/90 to-nude/30">
            <div className="absolute inset-0 backdrop-blur-sm"></div>
          </div>
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <h2 className="text-4xl font-serif mb-6">¡Contraseña actualizada!</h2>
            <p className="text-lg text-center mb-8 max-w-md">
              Tu contraseña ha sido cambiada exitosamente.
              Serás redirigido al inicio de sesión en unos segundos...
            </p>
            {/* Círculos decorativos */}
            <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-nude/20"></div>
            <div className="absolute bottom-1/3 left-1/4 w-40 h-40 rounded-full bg-nude/10"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-nude/15"></div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex-1 overflow-y-auto bg-nude">
          <div className="min-h-full flex flex-col justify-center items-center p-6 md:p-12">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center mb-8">
                <img src="/logo_glimmer.png" alt="Logo" className="mx-auto h-16 mb-4" />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-serif text-gray-900 mb-2">¡Contraseña actualizada!</h2>
                <p className="text-gray-600">Serás redirigido al inicio de sesión en unos segundos...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full flex flex-col md:flex-row">
      {/* Sección izquierda - Decorativa */}
      <div className="hidden md:flex md:w-1/2 bg-[#5EA692] relative overflow-hidden justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5EA692]/90 to-nude/30">
          <div className="absolute inset-0 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <h2 className="text-4xl font-serif mb-6">Cambia tu contraseña</h2>
          <p className="text-lg text-center mb-8 max-w-md">
            Ingresa y confirma tu nueva contraseña para recuperar el acceso a tu cuenta
          </p>
          {/* Círculos decorativos */}
          <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-nude/20"></div>
          <div className="absolute bottom-1/3 left-1/4 w-40 h-40 rounded-full bg-nude/10"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-nude/15"></div>
        </div>
      </div>

      {/* Sección derecha - Formulario */}
      <div className="w-full md:w-1/2 flex-1 overflow-y-auto bg-nude">
        <div className="min-h-full flex flex-col justify-center items-center p-6 md:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <img src="/logo_glimmer.png" alt="Logo" className="mx-auto h-16 mb-4" />
            </div>

            {/* Encabezado móvil */}
            <div className="md:hidden text-center mb-8">
              <h2 className="text-3xl font-serif text-gray-900 mb-2">Cambia tu contraseña</h2>
              <p className="text-gray-600">Ingresa y confirma tu nueva contraseña</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Nueva contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                             placeholder-gray-400 focus:outline-none focus:ring-[#5EA692] focus:border-[#5EA692]
                             transition duration-150 ease-in-out"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    minLength={8}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                             placeholder-gray-400 focus:outline-none focus:ring-[#5EA692] focus:border-[#5EA692]
                             transition duration-150 ease-in-out"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent 
                         rounded-lg shadow-sm text-sm font-medium text-white bg-[#5EA692] hover:bg-[#4c8576]
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5EA692]
                         transition duration-150 ease-in-out space-x-2"
              >
                <span>{loading ? 'Actualizando...' : 'Actualizar contraseña'}</span>
                <ArrowRightIcon className="h-5 w-5" />
              </button>

              <div className="text-center">
                <Link to="/login" className="font-medium text-[#5EA692] hover:text-[#4c8576]">
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;