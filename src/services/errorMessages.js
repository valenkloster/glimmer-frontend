export const translateError = (error) => {
    const errorMessages = {
      'Invalid credentials': 'Credenciales inválidas',
      'Incorrect username or password': 'Usuario o contraseña incorrectos',
      'User not found': 'Usuario no encontrado',
      'Email already exists': 'El correo electrónico ya está registrado',
      'Invalid password': 'Contraseña inválida',
      'Password too short': 'La contraseña es demasiado corta',
      'Invalid token': 'Sesión inválida',
      'Token expired': 'La sesión ha expirado',
      'Server error': 'Error en el servidor',
      'Network error': 'Error de conexión',
      'Invalid request': 'Solicitud inválida',
      'default': 'Ha ocurrido un error'
    };
    return errorMessages[error] || errorMessages.default;
  };