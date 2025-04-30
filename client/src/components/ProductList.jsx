import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/HomePage.module.css';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext'; // Import the product context


const ProductList = () => {
  const { products, loading, error } = useProducts(); // Get products, loading, and error from context
  const { setViewMode } = useCart();

  useEffect(() => {
    setViewMode('shop');
  }, [setViewMode]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category');

    // 🔍 Filter products by category if category exists in URL
    const filteredProducts = category
    ? products.filter(product =>
        product.category?.toLowerCase() === category.toLowerCase()
      )
    : products;
    console.log(filteredProducts);
    console.log(products);


  return (
    <div className={styles.productGrid}>
      {error && <p>{error}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found for category "{category}"</p>
      ) : (
        filteredProducts.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))
      )}
    </div>
  );
};

export default ProductList;
