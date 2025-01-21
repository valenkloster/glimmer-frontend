import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="fixed inset-0 w-full flex flex-col md:flex-row">
      {/* Sección izquierda - Decorativa */}
      <div className="hidden md:flex md:w-1/2 bg-[#5EA692] relative overflow-hidden justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5EA692]/90 to-[#F5F2ED]/30">
          <div className="absolute inset-0 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <h2 className="text-4xl font-serif mb-6">Bienvenido a Glimmer</h2>
          <p className="text-lg text-center mb-8 max-w-md">
            Descubre nuestra exclusiva colección de productos para el cuidado de la piel
          </p>
          {/* Círculos decorativos */}
          <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-[#F5F2ED]/20"></div>
          <div className="absolute bottom-1/3 left-1/4 w-40 h-40 rounded-full bg-[#F5F2ED]/10"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-[#F5F2ED]/15"></div>
        </div>
      </div>

      {/* Sección derecha - Formulario */}
      <div className="w-full md:w-1/2 flex-1 overflow-y-auto bg-[#F5F2ED]">
        <div className="min-h-full flex flex-col justify-center items-center p-6 md:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <img src="/logo_glimmer.png" alt="Logo" className="mx-auto h-16 mb-4" />
            </div>

            {/* Encabezado móvil */}
            <div className="md:hidden text-center mb-8">
              <h2 className="text-3xl font-serif text-gray-900 mb-2">Bienvenido a Glimmer</h2>
              <p className="text-gray-600">Tu ritual diario de belleza comienza aquí</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                             placeholder-gray-400 focus:outline-none focus:ring-[#5EA692] focus:border-[#5EA692]
                             transition duration-150 ease-in-out"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
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
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#5EA692] focus:ring-[#5EA692] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-[#5EA692] hover:text-[#4c8576]">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent 
                         rounded-lg shadow-sm text-sm font-medium text-white bg-[#5EA692] hover:bg-[#4c8576]
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5EA692]
                         transition duration-150 ease-in-out space-x-2"
              >
                <span>Iniciar Sesión</span>
                <ArrowRightIcon className="h-5 w-5" />
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#F5F2ED] text-gray-500">¿Nuevo en Glimmer?</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/register')}
                className="w-full flex justify-center items-center px-4 py-3 border border-[#5EA692]
                         rounded-lg shadow-sm text-sm font-medium text-[#5EA692] bg-transparent 
                         hover:bg-[#5EA692] hover:text-white focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-[#5EA692] transition duration-150 ease-in-out"
              >
                Crear cuenta
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;