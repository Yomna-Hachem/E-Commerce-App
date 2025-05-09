import React, { useState } from 'react';
import styles from '../styles/Products.module.css';
import { useProducts } from '../context/ProductContext';
import { useCartDataContext } from '../context/CartDataContext';
import { useMemo } from 'react';
import { useEffect } from 'react';

const SIZES = ['Small', 'Medium', 'Large', 'XLarge'];

const Products = () => {
  const { products } = useProducts();
  const { stockMap, setStockMap, fetchStockData } = useCartDataContext();
  const LOW_STOCK_THRESHOLD = 5; // Define your low stock threshold here

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [stockPopupVisible, setStockPopupVisible] = useState(false);
  const [currentStocks, setCurrentStocks] = useState({});

    // Helper function to check if product has low stock
    const hasLowStock = useMemo(() => {
        const lowStockMap = {};
        products.forEach(product => {
          const productStocks = stockMap.filter(item => item.product_id === product.product_id);
          lowStockMap[product.product_id] = productStocks.some(stock => 
            stock.quantity < LOW_STOCK_THRESHOLD || stock.quantity == 0
          );
        });
        return lowStockMap;
      }, [products, stockMap]);

  // Function to open the stock management popup
  const openStockPopup = (productId) => {
    // Get all stock entries for this product from stockMap
    const productStockEntries = stockMap.filter(item => item.product_id === productId);
    
    // Convert the array of stock entries into an object by size
    const initialStock = productStockEntries.reduce((acc, stockEntry) => {
      acc[stockEntry.size] = stockEntry.quantity;
      return acc;
    }, {});

    // Initialize any missing sizes with 0
    SIZES.forEach(size => {
      if (initialStock[size] === undefined) {
        initialStock[size] = 0;
      }
    });

    setSelectedProductId(productId);
    setCurrentStocks(initialStock);
    setStockPopupVisible(true);
  };

  // Function to close the stock popup
  const closeStockPopup = () => {
    setSelectedProductId(null);
    setStockPopupVisible(false);
  };

  // Function to handle stock value changes
  const handleStockChange = (size, value) => {
    const intVal = parseInt(value, 10) || 0;
    setCurrentStocks(prev => ({ ...prev, [size]: intVal }));
  };

  // Function to save the updated stock values
  const handleUpdateStock = async () => {
    try {
      // Prepare the payload for the API call
      const stockUpdates = SIZES.map(size => ({
        product_id: selectedProductId,
        size,
        quantity: currentStocks[size] || 0
      }));
  

      const response = await fetch('http://localhost:5001/admin/manageProducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({stockUpdates}),
      });
      
      const message = await response.json();
        console.log(message); // Log the response message for debugging
      if (!response.ok) {
        throw new Error('Failed to update stock');
      }
  

      const updatedStockMap = stockMap.filter(item => item.product_id !== selectedProductId);
      stockUpdates.forEach(update => {
        updatedStockMap.push(update);
      });
  
      setStockMap(updatedStockMap);
      fetchStockData(); // Fetch the updated stock map from the server
      closeStockPopup();
      
    } catch (error) {
      console.error('Error updating stock:', error);
      // Optionally show error to user
      alert('Failed to update stock. Please try again.');
    }
  };

  // Find product by ID
  const getProductById = (productId) => {
    return products.find(product => product.product_id === productId);
  };

  return (
<div className={styles.container}>
      <h2>Product Management</h2>
      <div className={styles.productGrid}>
        {products.map(product => (
          <div key={product.product_id} className={styles.productCard}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            
            {/* Add low stock warning */}
            {hasLowStock[product.product_id] && (
              <p className={styles.lowStockWarning}>Low Stock Levels</p>
            )}
            
            <button onClick={() => openStockPopup(product.product_id)}>
              Manage Stock
            </button>
          </div>
        ))}
      </div>

      <button className={styles.floatingButton} onClick={() => alert("Redirect to create product page")}>
        +
      </button>

      {stockPopupVisible && selectedProductId && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>Manage Stock - {getProductById(selectedProductId)?.name}</h3>
            {SIZES.map(size => {
              const quantity = currentStocks[size] || 0;
              const outOfStock = quantity === 0;
              
              return (
                <div key={size} className={styles.stockRow}>
                  <span>{size}:</span>
                  <button 
                    onClick={() => handleStockChange(size, quantity - 1)} 
                    disabled={quantity <= 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleStockChange(size, e.target.value)}
                    min="0"
                  />
                  <button onClick={() => handleStockChange(size, quantity + 1)}>+</button>
                  {outOfStock && <span className={styles.outOfStock}>Out of Stock</span>}
                </div>
              );
            })}
            <div className={styles.popupActions}>
              <button onClick={handleUpdateStock}>Save</button>
              <button onClick={closeStockPopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;