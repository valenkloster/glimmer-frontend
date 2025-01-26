import React, { useState } from 'react';
import { useAuth } from '../../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    user: {
      email: '',
      password: ''
    }
  });
  const [errors, setErrors] = useState({
    password: '',
    submit: ''
  });

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'password') {
      setFormData({
        ...formData,
        user: {
          ...formData.user,
          [name]: value
        }
      });
      
      if (name === 'password') {
        setErrors({ 
          ...errors, 
          password: validatePassword(value)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ ...errors, submit: '' });

    const passwordError = validatePassword(formData.user.password);
    if (passwordError) {
      setErrors({ ...errors, password: passwordError });
      return;
    }

    try {
      const result = await register(formData);
      
      if (result.success) {
        navigate('/login');
      } else {
        setErrors({ 
          ...errors, 
          submit: result.error || 'Error al registrarse' 
        });
      }
    } catch (error) {
      setErrors({ 
        ...errors, 
        submit: error.message || 'Error al conectar con el servidor' 
      });
    }
  };

  return (
    <div className="fixed inset-0 w-full flex flex-col md:flex-row">
      {/* Sección izquierda - Decorativa */}
      <div className="hidden md:flex md:w-1/2 bg-verde-agua relative overflow-hidden justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-verde-agua/90 to-nude/30">
          <div className="absolute inset-0 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <h2 className="text-4xl font-serif mb-6">Únete a Glimmer</h2>
          <p className="text-lg text-center mb-8 max-w-md">
            Descubre nuestra exclusiva colección de productos para el cuidado de la piel
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
              <h2 className="text-3xl font-serif text-gray-900 mb-2">Crear cuenta</h2>
              <p className="text-gray-600">Tu ritual diario de belleza comienza aquí</p>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <p className="text-red-700">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                               placeholder-gray-400 focus:outline-none focus:ring-verde-agua focus:border-verde-agua
                               transition duration-150 ease-in-out"
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                      Apellido
                    </label>
                    <input
                      id="apellido"
                      name="apellido"
                      type="text"
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                               placeholder-gray-400 focus:outline-none focus:ring-verde-agua focus:border-verde-agua
                               transition duration-150 ease-in-out"
                      value={formData.apellido}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                             placeholder-gray-400 focus:outline-none focus:ring-verde-agua focus:border-verde-agua
                             transition duration-150 ease-in-out"
                    value={formData.user.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    className={`appearance-none block w-full px-4 py-3 border rounded-lg shadow-sm 
                             placeholder-gray-400 focus:outline-none focus:ring-verde-agua focus:border-verde-agua
                             transition duration-150 ease-in-out ${
                               errors.password ? 'border-red-300' : 'border-gray-300'
                             }`}
                    value={formData.user.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent 
                         rounded-lg shadow-sm text-sm font-medium text-white bg-verde-agua hover:bg-[#4c8576]
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-agua
                         transition duration-150 ease-in-out space-x-2"
              >
                <span>Crear cuenta</span>
                <ArrowRightIcon className="h-5 w-5" />
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-nude text-gray-500">¿Ya tienes cuenta?</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full flex justify-center items-center px-4 py-3 border border-verde-agua
                         rounded-lg shadow-sm text-sm font-medium text-verde-agua bg-transparent 
                         hover:bg-verde-agua hover:text-white focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-verde-agua transition duration-150 ease-in-out"
              >
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;