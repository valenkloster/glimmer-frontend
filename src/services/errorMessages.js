export const translateError = (error) => {
    const errorMessages = {
      // Errores de autenticación
      'Invalid credentials': 'Credenciales inválidas',
      'User not found': 'Usuario no encontrado',
      'Email already exists': 'El correo electrónico ya está registrado',
      'Invalid password': 'Contraseña inválida',
      'Password too short': 'La contraseña es demasiado corta',
      'Invalid token': 'Sesión inválida',
      'Token expired': 'La sesión ha expirado',
      
      // Errores generales
      'Server error': 'Error en el servidor',
      'Network error': 'Error de conexión',
      'Invalid request': 'Solicitud inválida',
      
      // Mensaje por defecto si no encuentra traducción
      'default': 'Ha ocurrido un error'
    };
  
    // Si existe una traducción para el error, la devuelve
    // Si no, devuelve el mensaje por defecto
    return errorMessages[error] || errorMessages.default;
  };