import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from '../styles/productCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, viewMode } = useCart();

  // Calculate original price if there's a discount
  const originalPrice = product.discount > 0 
    ? (product.price / (1 - product.discount / 100)).toFixed(2)
    : null;

  return (
    <div className={styles.productCard}>
  <img src={product.image_url} alt={product.name} />
  <h3>{product.name}</h3>
  
  {/* Price display */}
  {product.discount > 0 ? (
    <div className={styles.priceContainer}>
      <span className={styles.originalPrice}>${originalPrice}</span>
      <span className={styles.discountedPrice}>${product.price.toFixed(2)}</span>
      <span className={styles.discountBadge}>{product.discount}% OFF</span>
    </div>
  ) : (
    <p className={styles.regularPrice}>${product.price.toFixed(2)}</p>
  )}
  
  <Link to={`/ProductDetails/${product.product_id}`} className={styles.viewButton}>
    <button>View Item</button>
  </Link>
</div>
  );
};

export default ProductCard;