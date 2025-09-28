import React from 'react';
import { useAuth } from '../context/AuthContext';

const DebugInfo = () => {
  const { isAuthenticated, user, loading } = useAuth();
  
  return (
    <div style={{
      background: '#f0f0f0',
      padding: '20px',
      margin: '10px',
      border: '2px solid red',
      borderRadius: '5px',
      fontFamily: 'monospace'
    }}>
      <h3>🔧 Debug Information</h3>
      <p><strong>Auth Loading:</strong> {loading ? 'Yes' : 'No'}</p>
      <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
      <p><strong>User:</strong> {user ? JSON.stringify(user) : 'None'}</p>
      <p><strong>Window Location:</strong> {window.location.href}</p>
    </div>
  );
};

export default DebugInfo;