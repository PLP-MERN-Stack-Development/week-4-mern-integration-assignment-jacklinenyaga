import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        setError(err.message || 'Authentication check failed');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Remove useAuth export from this file.
// Move useAuth to a separate file, e.g., useAuth.js.