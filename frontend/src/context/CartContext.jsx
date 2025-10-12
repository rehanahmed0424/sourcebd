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
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage on component mount
  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  // Update cart count when cart items change
  useEffect(() => {
    // Count distinct items (not total quantity)
    const distinctItemCount = cartItems.length;
    setCartCount(distinctItemCount);
    
    // Save to localStorage
    try {
      localStorage.setItem('sourcebd_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Load cart from localStorage
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

  // Add item to cart - FIXED VERSION
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }

    console.log('Adding to cart:', { product, quantity }); // Debug log

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // If item exists, use the NEW quantity from the product parameter, not add to existing quantity
        const updatedItems = [...prevItems];
        const newQuantity = product.quantity || quantity;
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity, // Use the new quantity, don't add to existing
          subtotal: (updatedItems[existingItemIndex].price || 0) * newQuantity
        };
        console.log('Updated existing item:', updatedItems[existingItemIndex]); // Debug log
        return updatedItems;
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
          quantity: itemQuantity, // Use the passed quantity
          subtotal: price * itemQuantity
        };
        console.log('Added new item:', newItem); // Debug log
        return [...prevItems, newItem];
      }
    });
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { 
              ...item, 
              quantity: newQuantity,
              subtotal: (item.price || 0) * newQuantity
            }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('sourcebd_cart');
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
    cartCount, // Number of distinct items
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getTotalQuantity,
    refreshCart: loadCartFromLocalStorage
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};