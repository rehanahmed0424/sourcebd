import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load cart from localStorage on component mount
  useEffect(() => {
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
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('sourcebd_cart', JSON.stringify(cartItems));
      const count = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 0) + (product.quantity || 1),
          subtotal: (updatedItems[existingItemIndex].price || 0) * ((updatedItems[existingItemIndex].quantity || 0) + (product.quantity || 1))
        };
        return updatedItems;
      } else {
        // Add new item
        const newItem = {
          id: product.id,
          name: product.name || 'Unknown Product',
          supplier: product.supplier || 'Unknown Supplier',
          moq: product.moq || 1,
          image: product.image || '/images/placeholder.jpg',
          price: product.price || 0,
          quantity: product.quantity || 1,
          subtotal: (product.price || 0) * (product.quantity || 1)
        };
        return [...prevItems, newItem];
      }
    });
  };

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

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.subtotal || 0), 0);
  };

  const value = {
    cartItems,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};