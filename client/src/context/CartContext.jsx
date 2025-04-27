import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);


export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [viewMode, setViewMode] = useState('Cart');

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter(p => p.product_id !== productId));
  };

  const emptyCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, emptyCart, removeFromCart, viewMode, setViewMode}}>
      {children}
    </CartContext.Provider>
  );
};
