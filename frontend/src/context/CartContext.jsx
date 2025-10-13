import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create and export the CartContext
export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromBackend();
    } else {
      // For non-authenticated users, use localStorage as fallback
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated, user]);

  // Update cart count when cart items change
  useEffect(() => {
    const distinctItemCount = cartItems.length;
    setCartCount(distinctItemCount);
  }, [cartItems]);

  // Load cart from backend API
  const loadCartFromBackend = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        loadCartFromLocalStorage();
        return;
      }

      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const cartData = await response.json();
        setCartItems(cartData.items || []);
      } else {
        // If backend fails, fallback to localStorage
        loadCartFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading cart from backend:', error);
      loadCartFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load cart from localStorage (for non-authenticated users)
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('sourcebd_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCartItems([]);
    }
  };

  // Save cart to backend or localStorage
  const saveCart = async (items) => {
    if (isAuthenticated && user) {
      await saveCartToBackend(items);
    } else {
      saveCartToLocalStorage(items);
    }
  };

  // Save cart to backend API
  const saveCartToBackend = async (items) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Update each item in the backend cart
      for (const item of items) {
        await fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price
          }),
        });
      }
    } catch (error) {
      console.error('Error saving cart to backend:', error);
      // Fallback to localStorage if backend fails
      saveCartToLocalStorage(items);
    }
  };

  // Save cart to localStorage
  const saveCartToLocalStorage = (items) => {
    try {
      localStorage.setItem('sourcebd_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      let newItems;

      if (existingItemIndex > -1) {
        // If item exists, use the NEW quantity from the product parameter, not add to existing quantity
        newItems = [...prevItems];
        const newQuantity = product.quantity || quantity;
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity,
          subtotal: (newItems[existingItemIndex].price || 0) * newQuantity
        };
      } else {
        // Add new item
        const price = product.price || product.tieredPricing?.[0]?.price || 0;
        const itemQuantity = product.quantity || quantity;
        const newItem = {
          id: product.id,
          name: product.name || 'Unknown Product',
          supplier: product.supplier || 'Unknown Supplier',
          moq: product.moq || 1,
          image: product.image || '/images/placeholder.jpg',
          price: price,
          quantity: itemQuantity,
          subtotal: price * itemQuantity
        };
        newItems = [...prevItems, newItem];
      }

      // Save to backend or localStorage
      saveCart(newItems);
      return newItems;
    });
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => {
      const newItems = prevItems.map(item => 
        item.id === productId 
          ? { 
              ...item, 
              quantity: newQuantity,
              subtotal: (item.price || 0) * newQuantity
            }
          : item
      );
      
      // Save to backend or localStorage
      saveCart(newItems);
      return newItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      // Save to backend or localStorage
      saveCart(newItems);
      return newItems;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    if (isAuthenticated && user) {
      // Clear backend cart by setting all quantities to 0
      saveCartToBackend([]);
    } else {
      localStorage.removeItem('sourcebd_cart');
    }
  };

  // Calculate cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.subtotal || 0), 0);
  };

  // Get total quantity (for cart page display)
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getTotalQuantity,
    refreshCart: isAuthenticated ? loadCartFromBackend : loadCartFromLocalStorage
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};