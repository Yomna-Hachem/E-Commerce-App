// PromotionsManagement.jsx
import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import styles from '../styles/Promotions.module.css';

const PromotionsManagement = () => {
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [selectedCampaignProducts, setSelectedCampaignProducts] = useState([]);
  const [campaignDiscount, setCampaignDiscount] = useState('');
  const [campaignStartDate, setCampaignStartDate] = useState('');
  const [campaignStats, setCampaignStats] = useState([]);

  useEffect(() => {
    if (selectedProduct) {
      const product = products.find(p => p.product_id === selectedProduct);
      setDiscountValue(product?.discount || '');
    }
  }, [selectedProduct, products]);

  const handleCampaignProductToggle = (productId) => {
    setSelectedCampaignProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProductDiscountSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || discountValue === '') return;

    try {
      const response = await fetch('http://localhost:5001/update-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct,
          discount: parseFloat(discountValue)
        })
      });

      if (response.ok) {
        alert('Discount applied successfully');
        setSelectedProduct('');
        setDiscountValue('');
      } else {
        throw new Error('Failed to apply discount');
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      alert('Error applying discount');
    }
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCampaignProducts.length || !campaignDiscount || !campaignStartDate) return;

    try {
      const response = await fetch('http://localhost:5001/create-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedCampaignProducts,
          discount: parseFloat(campaignDiscount),
          startDate: campaignStartDate
        })
      });

      if (response.ok) {
        const data = await response.json();
        setActiveCampaign(data.campaign);
        alert('Campaign started successfully');
      } else {
        throw new Error('Failed to start campaign');
      }
    } catch (error) {
      console.error('Error starting campaign:', error);
      alert('Error starting campaign');
    }
  };

  return (
    <div className={styles.promotionsContainer}>
      <h2 className={styles.sectionTitle}>Promotions Management</h2>

      <div className={styles.sectionCard}>
        <h3 className={styles.sectionSubtitle}>Apply Product Discount</h3>
        <form onSubmit={handleProductDiscountSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Select Product:</label>
            <select 
              value={selectedProduct} 
              onChange={(e) => setSelectedProduct(e.target.value)}
              disabled={loading}
              className={styles.formSelect}
            >
              <option value="">-- Select a product --</option>
              {products.map(product => (
                <option key={product.product_id} value={product.product_id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Discount Percentage:</label>
            <input 
              type="number" 
              min="0" 
              max="100" 
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder="Enter discount"
              className={styles.formInput}
            />
            <span className={styles.percentSymbol}>%</span>
          </div>

          <button 
            type="submit" 
            className={styles.primaryButton}
            disabled={!selectedProduct || discountValue === ''}
          >
            Apply Discount
          </button>
        </form>
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.sectionSubtitle}>Run a Campaign</h3>
        {activeCampaign && (
          <div className={styles.activeCampaignBanner}>
            <p className={styles.campaignInfo}>
              <strong>Active Campaign:</strong> {activeCampaign.discount}% off | 
              Started: {new Date(activeCampaign.startDate).toLocaleDateString()}
            </p>
            <button onClick={() => setActiveCampaign(null)} className={styles.secondaryButton}>
              Refresh Stats
            </button>
          </div>
        )}

        <form onSubmit={handleCampaignSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Select Products:</label>
            <div className={styles.productCheckboxes}>
              {products.map(product => (
                <div key={product.product_id} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    id={`campaign-product-${product.product_id}`}
                    value={product.product_id}
                    checked={selectedCampaignProducts.includes(product.product_id)}
                    onChange={() => handleCampaignProductToggle(product.product_id)}
                    className={styles.checkboxInput}
                  />
                  <label htmlFor={`campaign-product-${product.product_id}`} className={styles.checkboxLabel}>
                    {product.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Campaign Discount:</label>
            <input 
              type="number" 
              min="0" 
              max="100" 
              value={campaignDiscount}
              onChange={(e) => setCampaignDiscount(e.target.value)}
              placeholder="Enter discount"
              className={styles.formInput}
            />
            <span className={styles.percentSymbol}>%</span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Start Date:</label>
            <input 
              type="date" 
              value={campaignStartDate}
              onChange={(e) => setCampaignStartDate(e.target.value)}
              className={styles.formInput}
            />
          </div>

          <button 
            type="submit" 
            className={styles.primaryButton}
            disabled={!selectedCampaignProducts.length || !campaignDiscount || !campaignStartDate}
          >
            {activeCampaign ? 'Update Campaign' : 'Start Campaign'}
          </button>
        </form>

        {campaignStats.length > 0 && (
          <div className={styles.campaignStats}>
            <h4 className={styles.statsTitle}>Campaign Performance</h4>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Product</th>
                  <th className={styles.tableHeader}>Units Sold</th>
                  <th className={styles.tableHeader}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {campaignStats.map(stat => (
                  <tr key={stat.productId} className={styles.tableRow}>
                    <td className={styles.tableCell}>{products.find(p => p.product_id === stat.productId)?.name || 'Unknown'}</td>
                    <td className={styles.tableCell}>{stat.unitsSold}</td>
                    <td className={styles.tableCell}>${stat.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsManagement;