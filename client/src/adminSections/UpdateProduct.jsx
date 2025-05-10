import React, { useState, useEffect } from "react";
import { useProducts } from '../context/ProductContext';
import AlertComponent from '../components/AlertComponent';
import styles from '../styles/UpdateProduct.module.css';

const UpdateProduct = ({ productId }) => {
  const categoryMap = {
    'cec5db6f-9de9-40f5-af22-9e5be25166c8': 'Men',
    '1b1a1886-b759-406a-9702-019846e0819e': 'Women',
    'ba0ab28c-250c-43d8-8336-a9bc81ffd334': 'Sportswear',
    '0c1022e2-2f45-4867-a179-c1902c3bcd9d': 'Bestsellers',
  };

  const { products, loading } = useProducts();
  const product = products.find(p => p.product_id.startsWith(productId));

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '',
    price: '',
    category_id: ''
  });

  const [alert, setAlert] = useState({
    show: false,
    message: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        color: product.color,
        price: product.price,
        category_id: product.category_id
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, price: isNaN(value) ? '' : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/admin/updateProduct', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: product.product_id,
          ...formData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({
          show: true,
          message: 'Product updated successfully!',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setAlert({
          show: true,
          message: `Update failed: ${data.error}`,
        });
      }
    } catch (err) {
      console.error("Error submitting form", err);
      setAlert({
        show: true,
        message: 'Error updating product. Please try again.',
      });
    }
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Update Product</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Product Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="color" className={styles.label}>Color</label>
          <input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>Price ($)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price !== '' ? Number(formData.price).toFixed(2) : ''}
            onChange={handlePriceChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category_id" className={styles.label}>Category</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Select a category</option>
            {Object.entries(categoryMap).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Update Product
        </button>
      </form>

      <AlertComponent 
        show={alert.show}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
};

export default UpdateProduct;