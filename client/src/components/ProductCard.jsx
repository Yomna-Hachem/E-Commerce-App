import React from 'react';
import { useCart } from '../context/CartContext';
import styles from '../styles/productCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, viewMode } = useCart();

  const isInCart = cartItems.some(item => item.product_id === product.product_id);

  const handleClick = () => {
    if (viewMode === 'cart') {
      removeFromCart(product.product_id);
    } else {
      addToCart(product);
    }
  };

  const buttonText = viewMode === 'cart'
    ? 'Remove from Cart'
    : isInCart
      ? 'In Cart'
      : 'Add to Cart';

  return (
    <div className={styles.productCard}>
      <img
        src={product.image_url || 'https://via.placeholder.com/200'}
        alt={product.name}
      />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button
        onClick={handleClick}
        disabled={viewMode !== 'cart' && isInCart}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ProductCard;
