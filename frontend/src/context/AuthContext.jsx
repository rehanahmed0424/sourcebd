import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem('sourcebd_token');
        const storedUser = localStorage.getItem('sourcebd_user');
        
        if (storedToken && storedUser) {
          // Basic token validation (in a real app, you might verify with the server)
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear corrupted data
        localStorage.removeItem('sourcebd_token');
        localStorage.removeItem('sourcebd_user');
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const handleStorageChange = (e) => {
      if (e.key === 'sourcebd_user' || e.key === 'sourcebd_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (token, userData) => {
    try {
      // Use app-specific keys to avoid conflicts
      localStorage.setItem('sourcebd_token', token);
      localStorage.setItem('sourcebd_user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Failed to save authentication data');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('sourcebd_token');
      localStorage.removeItem('sourcebd_user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Function to get the auth header for API requests
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Function to check if token is expired (basic client-side check)
  const isTokenExpired = () => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const value = {
    isAuthenticated, 
    user, 
    token,
    login, 
    logout,
    loading,
    getAuthHeader,
    isTokenExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};