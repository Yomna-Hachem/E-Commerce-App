import React, { useState } from 'react';
import styles from '../styles/AddProduct.module.css'; // Adjust the path as needed
import AlertComponent from '../components/AlertComponent';
import { useProducts } from '../context/ProductContext';
const AddProduct = () => {
  // Dictionary mapping category IDs to category names
  const categoryMap = {
    'cec5db6f-9de9-40f5-af22-9e5be25166c8': 'Men',
    '1b1a1886-b759-406a-9702-019846e0819e': 'Women',
    'ba0ab28c-250c-43d8-8336-a9bc81ffd334': 'Sportswear',
    '0c1022e2-2f45-4867-a179-c1902c3bcd9d': 'Bestsellers',
    '574f4d75-c70d-41ff-b31a-65dc5896672d': 'New Arrivals',
  };

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    color: '',
    category_id: '', // This will store the selected category ID
    product_tax_category_id: '',
  });
  const [image, setImage] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '' });
  const { products, setProducts } = useProducts();
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    const selectedCategoryId = Object.keys(categoryMap).find(
      (key) => categoryMap[key] === selectedCategoryName
    );
    setFormData((prev) => ({ ...prev, category_id: selectedCategoryId }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('image', image);
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await fetch('http://localhost:5001/admin/addNewProduct', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      const result = await response.json();
      if (response.ok) {
        setAlert({ show: true, message: 'Product added successfully' });
        setFormData({
          name: '',
          price: '',
          description: '',
          color: '',
          category_id: '',
          product_tax_category_id: '',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        setProducts((prev) => [...prev, result.product]); // Assuming the API returns the new product
        setImage(null);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setAlert({ show: true, message: 'Failed to add product. Please try again.' });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Product</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={styles.input}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={styles.textarea}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Category</label>
          <div className={styles.selectWrapper}>
            <select
              value={categoryMap[formData.category_id] || ''}
              onChange={handleCategoryChange}
              className={styles.select}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {Object.values(categoryMap).map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}></span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Product Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className={styles.fileInput}
            accept="image/*"
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Add Product
        </button>
      </form>
      <AlertComponent 
  message={alert.message} 
  show={alert.show} 
  onClose={() => setAlert({ show: false, message: '' })}
  
/>
    </div>
  );
};

export default AddProduct;