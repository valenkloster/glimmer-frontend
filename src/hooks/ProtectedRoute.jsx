import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nude">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5EA692]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Guardamos la ubicación actual para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;