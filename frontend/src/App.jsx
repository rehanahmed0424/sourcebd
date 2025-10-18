import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Cart from './pages/Cart';
import Category from './pages/Category';
import SearchResults from './pages/SearchResults';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import RFQ from './pages/rfq';
import MyProfile from './pages/myprofile';
import MyOrders from './pages/myorders';
import Checkout from './pages/checkout';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ color: '#e74c3c' }}>Something went wrong</h1>
          <p>We're working on fixing this issue. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: '#2d4d31',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary>Error Details</summary>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
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
              <Route path="/wishlist" element={<MainLayout><Wishlist /></MainLayout>} />
              <Route path="/category/:categoryName" element={<MainLayout><Category /></MainLayout>} />
              <Route path="/search" element={<MainLayout><SearchResults /></MainLayout>} />
              <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
              <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
              <Route path="/rfq" element={<MainLayout><RFQ /></MainLayout>} />
              <Route path="/my-profile" element={<MainLayout><MyProfile /></MainLayout>} />
              <Route path="/my-orders" element={<MainLayout><MyOrders /></MainLayout>} />
              <Route path="/terms-of-service" element={<MainLayout><TermsOfService /></MainLayout>} />
              <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
              <Route path="*" element={<MainLayout><div>404 - Page Not Found</div></MainLayout>} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;