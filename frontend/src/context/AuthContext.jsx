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

  // Add updateProfile function

const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('sourcebd_token');
    
    const response = await fetch('http://localhost:5000/api/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData, let the browser set it
      },
      body: profileData instanceof FormData ? profileData : JSON.stringify(profileData)
    });

    if (response.ok) {
      const updatedUser = await response.json();
      
      // Update both state and localStorage
      const newUserData = { ...user, ...updatedUser };
      setUser(newUserData);
      localStorage.setItem('sourcebd_user', JSON.stringify(newUserData));
      
      return updatedUser;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

  // Add refreshUser function to sync with server
  const refreshUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          ...getAuthHeader()
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('sourcebd_user', JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Add changePassword function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
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
    isTokenExpired,
    updateProfile, // Added
    refreshUser,   // Added
    changePassword // Added
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};