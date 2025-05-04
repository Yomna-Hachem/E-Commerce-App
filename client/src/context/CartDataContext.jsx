import React, { createContext, useState, useEffect, useContext } from 'react';
import { useUserContext } from './UserContext';
const CartDataContext = createContext();


export const CartDataProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext(); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [stockMap, setStockMap] = useState([]);

  const fetchStockData = async () => {
    try {
      const response = await fetch('http://localhost:5001/products/stockInfo');
      const mapped = await response.json();
      setStockMap(mapped);
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
    }
  };
  
  useEffect(() => {
    fetchStockData();
    console.log('Stock data fetched:', stockMap);
  }, []);



  // Fetch cart items from backend
  useEffect(() => {
    const fetchCartData = async () => {
      
      if (user && user?.user_id) {
        try {
        console.log('Fetching cart data for user 🦮');
        const response = await fetch(`http://localhost:5001/cart/${user.user_id}`);
        const data = await response.json();
        setCartData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    } else {
        // No user logged in → clear cart
        setCartData([]);
        setLoading(false);
      }
}
      fetchCartData();
  }, [user?.user_id]); 


  const addToCart = async (item) => {
    if (isProcessing) return; // Prevent multiple submissions
    setIsProcessing(true); // Set processing state to true
    setCartData(prevItems => {
      const existingItem = prevItems.find(
        p => p.product_id === item.product_id && p.size === item.size
      );
    
      if (existingItem) {
        // Add or subtract based on the flag
        return prevItems.map(p =>
          p.product_id === item.product_id && p.size === item.size
            ? {
                ...p,
                quantity:
                  item.flag === 1
                    ? p.quantity + item.quantity
                    : p.quantity - item.quantity
              }
            : p
        );
      } else {
        // Add new item to cart
        return [...prevItems, item];
      }
    });
    
    
    try {
      const response = await fetch('http://localhost:5001/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });
      if (!response.ok) {
        throw new Error('Failed to add item to cart in DB');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Optionally, you can remove the item from UI again if DB fails
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  const removeFromCart = async (product_id, size) => {
    setCartData(prevItems =>
      prevItems.filter(item => !(item.product_id === product_id && item.size === size))
    );
      
    try {
      const response = await fetch('http://localhost:5001/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: user.user_id, product_id: product_id, size: size })
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart in DB');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      // Optionally, you can re-add the item to UI if DB fails
    }
  };


  return (
    <CartDataContext.Provider value={{ 
      cartData, 
      loading, 
      setCartData, 
      addToCart, 
      removeFromCart ,
      isProcessing ,
      stockMap
    }}>
      {children}
    </CartDataContext.Provider>
  );
  


};

// Custom hook for ease of use
export const useCartDataContext = () => useContext(CartDataContext);
