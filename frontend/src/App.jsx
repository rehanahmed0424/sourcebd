import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminPanel from './pages/AdminPanel'; // Added admin panel route

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/admin" element={<MainLayout><AdminPanel /></MainLayout>} /> {/* Admin panel route */}
        {/* Add more routes as needed */}
        <Route path="*" element={<MainLayout><div>404 - Page Not Found</div></MainLayout>} /> {/* Catch-all 404 */}
      </Routes>
    </AuthProvider>
  );
};

export default App;