import React, { useEffect, useState } from 'react';
import styles from '../styles/HomePage.module.css';
import ProductCard from './ProductCard'; 
import { useCart } from '../context/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const {setViewMode } = useCart();
  const [error, setError] = useState(null);

  useEffect(() => {
    setViewMode('shop');
  }, []);


  useEffect(() => {
    // Fetch products from the backend
    fetch('http://localhost:5001/products')
    
      .then((response) => response.json())
      .then((data) => {
      setProducts(data);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      });
  }, []);

  return (
    <div className={styles.productGrid}>
      {error && <p>{error}</p>}

      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))
      )}
    </div>
  );
};

export default ProductList;
