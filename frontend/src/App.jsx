import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/homepage';
import Login from './pages/login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Cart from './pages/Cart';
import Category from './pages/Category';
import SearchResults from './pages/SearchResults';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/admin" element={<MainLayout><AdminPanel /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/help" element={<MainLayout><Help /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
        <Route path="/category/:categoryName" element={<MainLayout><Category /></MainLayout>} />
        <Route path="/search" element={<MainLayout><SearchResults /></MainLayout>} />
        <Route path="*" element={<MainLayout><div>404 - Page Not Found</div></MainLayout>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;