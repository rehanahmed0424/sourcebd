import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help'; // New import

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/Login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/Register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/ForgotPassword" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/AdminPanel" element={<MainLayout><AdminPanel /></MainLayout>} />
        <Route path="/About" element={<MainLayout><About /></MainLayout>} />
        <Route path="/Contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/Help" element={<MainLayout><Help /></MainLayout>} /> {/* New route */}
        <Route path="*" element={<MainLayout><div>404 - Page Not Found</div></MainLayout>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;