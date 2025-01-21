import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const RegisterForm = () => {
  const navigate = useNavigate();
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

    // Validar contraseña antes de enviar
    const passwordError = validatePassword(formData.user.password);
    if (passwordError) {
      setErrors({ ...errors, password: passwordError });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/clientes/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setErrors({ 
          ...errors, 
          submit: data.message || 'Error al registrarse' 
        });
      }
    } catch (error) {
      setErrors({ 
        ...errors, 
        submit: 'Error al conectar con el servidor' 
      });
    }
  };

  return (
    <AuthLayout 
      title="Crear cuenta" 
      subtitle="Únete a nuestra comunidad"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}
        
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5EA692] focus:border-[#5EA692]"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5EA692] focus:border-[#5EA692]"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5EA692] focus:border-[#5EA692]"
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
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#5EA692] focus:border-[#5EA692] ${
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

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5EA692] hover:bg-[#4c8576] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5EA692]"
          >
            Registrarse
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-[#5EA692] hover:text-[#4c8576]"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterForm;