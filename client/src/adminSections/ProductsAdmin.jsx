import React, { useState, useMemo } from 'react';
import styles from '../styles/Products.module.css';
import { useProducts } from '../context/ProductContext';
import { useCartDataContext } from '../context/CartDataContext';
import ConfirmationComponent from '../components/confirmationComponent';
import AlertComponent from '../components/AlertComponent';
const SIZES = ['Small', 'Medium', 'Large', 'XLarge'];
const LOW_STOCK_THRESHOLD = 5;

const Products = ({ setActiveSection }) => {
  const { products, setProducts} = useProducts();
  const { stockMap, setStockMap, fetchStockData } = useCartDataContext();
  const [confirmDelete, setConfirmDelete] = useState({ show: false, productId: null });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [stockPopupVisible, setStockPopupVisible] = useState(false);
  const [currentStocks, setCurrentStocks] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '' });


 
  const hasLowStock = useMemo(() => {
    const lowStockMap = {};
    products.forEach(product => {
      const productStocks = stockMap.filter(item => item.product_id === product.product_id);
      lowStockMap[product.product_id] = productStocks.some(stock => 
        stock.quantity < LOW_STOCK_THRESHOLD || stock.quantity === 0
      );
    });
    return lowStockMap;
  }, [products, stockMap]);

  const openStockPopup = (productId) => {
    const productStockEntries = stockMap.filter(item => item.product_id === productId);
    const initialStock = productStockEntries.reduce((acc, stockEntry) => {
      acc[stockEntry.size] = stockEntry.quantity;
      return acc;
    }, {});

    SIZES.forEach(size => {
      if (initialStock[size] === undefined) {
        initialStock[size] = 0;
      }
    });

    setSelectedProductId(productId);
    setCurrentStocks(initialStock);
    setStockPopupVisible(true);
  };

  const closeStockPopup = () => {
    setStockPopupVisible(false);
    setSelectedProductId(null);
  };

  const handleStockChange = (size, value) => {
    const intVal = parseInt(value, 10) || 0;
    setCurrentStocks(prev => ({ ...prev, [size]: intVal }));
  };

  const handleUpdateStock = async () => {
    try {
      const stockUpdates = SIZES.map(size => ({
        product_id: selectedProductId,
        size,
        quantity: currentStocks[size] || 0
      }));

      const response = await fetch('http://localhost:5001/admin/manageProducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ stockUpdates }),
      });

      if (!response.ok) throw new Error('Failed to update stock');
      
      const updatedStockMap = stockMap.filter(item => item.product_id !== selectedProductId);
      stockUpdates.forEach(update => updatedStockMap.push(update));
      
      setStockMap(updatedStockMap);
      fetchStockData();
      closeStockPopup();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock. Please try again.');
    }
  };

  const getProductById = (productId) => {
    return products.find(product => product.product_id === productId);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5001/admin/deleteProduct`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });
  
      if (!response.ok) throw new Error('Failed to delete product');
  
      setAlert({ show: true, message: 'Product deleted successfully' });
      fetchStockData(); // Refresh product list
      setProducts(prevProducts => prevProducts.filter(p => p.product_id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      setAlert({ show: true, message: 'Failed to delete product. Please try again.' });
    }
  };
  
  

  return (
    <div className={styles.container}>
      <h2>Product Management</h2>
      
      <div className={styles.productGrid}>
        {products.map(product => (
          <div key={product.product_id} className={styles.productCard}>
            <div className={styles.productContent}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
              
              {hasLowStock[product.product_id] && (
                <p className={styles.lowStockWarning}>Low Stock Levels</p>
              )}
            </div>

            <div className={styles.buttonContainer}>
              <div className={styles.horizontalButtons}>
                <button
                  className={styles.updateButton}
                  onClick={() => setActiveSection(`updateProduct-${product.product_id}`)}
                >
                  Update
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => openStockPopup(product.product_id)}
                >
                  Manage Stock
                </button>
              </div>
              <button
                className={styles.manageStockButton}
                onClick={() => setConfirmDelete({ show: true, productId: product.product_id })}

              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className={styles.floatingButton}
        onClick={() => setActiveSection('addProduct')}
        aria-label="Add new product"
      >
        +
      </button>

      {stockPopupVisible && selectedProductId && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>Manage Stock - {getProductById(selectedProductId)?.name}</h3>
            
            {SIZES.map(size => {
              const quantity = currentStocks[size] || 0;
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
                  {quantity === 0 && <span className={styles.outOfStock}>Out of Stock</span>}
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
      <AlertComponent 
  message={alert.message} 
  show={alert.show} 
  onClose={() => setAlert({ show: false, message: '' })}
/>
      <ConfirmationComponent
  message="Are you sure you want to delete this product?"
  show={confirmDelete.show}
  onYes={async () => {
    await handleDeleteProduct(confirmDelete.productId);
    setConfirmDelete({ show: false, productId: null });
  }}
  onNo={() => setConfirmDelete({ show: false, productId: null })}
/>

    </div>
  );
};

export default Products;