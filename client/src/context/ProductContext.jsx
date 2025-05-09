import React, { createContext, useState, useEffect, useContext } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend (replace URL with your actual endpoint)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/products'); // change as needed
        const data = await response.json();
        const updatedData = data.map(item => ({
          ...item,
          price: item.price * (1 - item.discount / 100)
        }));
        setProducts(updatedData);
        console.log('Fetched products:', updatedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook for ease of use
export const useProducts = () => useContext(ProductContext);
