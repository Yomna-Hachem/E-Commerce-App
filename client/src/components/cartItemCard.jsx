import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/CartItemCard.module.css';
import { useCartDataContext } from '../context/CartDataContext';
import { useUserContext } from '../context/UserContext';

const CartItemCard = ({ CartItem, quantity, size }) => {
  const { removeFromCart, addToCart, isProcessing, stockMap } = useCartDataContext();
  const [safeQuantity, setSafeQuantity] = useState(parseInt(quantity) || 0);
  const { user } = useUserContext();
  const [, forceUpdate] = useState(0);
  const hasRun = useRef(false);

  const safePrice = parseFloat(CartItem?.price) || 0;
  const totalPrice = safePrice * safeQuantity;

  // Get stock limit for this item and size
  const maxQuantity = stockMap?.find(
    (item) =>
      item.product_id === CartItem.product_id &&
      item.size?.toLowerCase() === size.toLowerCase()
  )?.quantity ;

  // Sync quantity with stock changes
  useEffect(() => {
    if (hasRun.current) return; // Already ran, skip
    hasRun.current = true;
    if (safeQuantity > maxQuantity) {
      const tempCartItemForMax = {
        user_id: user.user_id,
        product_id: CartItem.product_id,
        quantity: safeQuantity - maxQuantity,
        size: size,
        flag: 0
      };
      console.log('Quantity exceeded stock limit. Adjusting to max quantity:', safeQuantity-maxQuantity);
      addToCart(tempCartItemForMax);
      setSafeQuantity(maxQuantity); // Adjust quantity to available stock if exceeded
    }
  }, [maxQuantity, safeQuantity]);

  useEffect(() => {
    forceUpdate(prev => prev + 1); // Trigger re-render when isProcessing changes
  }, [isProcessing]);

  const handleQuantityIncrease = () => {
    if (safeQuantity < maxQuantity) {
      setSafeQuantity(prev => prev + 1);
      const tempCartItem = {
        user_id: user.user_id,
        product_id: CartItem.product_id,
        quantity: 1,
        size: size,
        flag: 1
      };
      addToCart(tempCartItem);
    }
  };

  const handleQuantityDecrease = () => {
    if (safeQuantity > 1) {
      setSafeQuantity(prev => prev - 1);
      const tempCartItem = {
        user_id: user.user_id,
        product_id: CartItem.product_id,
        quantity: 1,
        size: size,
        flag: 0
      };
      addToCart(tempCartItem);
    }
  };

  return (
    <div className={styles.cartItemCard}>
      <img
        src={CartItem.image_url || 'https://via.placeholder.com/200'}
        alt={CartItem.name}
      />
      <h3>{CartItem.name}</h3>
      <p>Size: {size}</p>

      <div className={styles.quantityContainer}>
        <button
          onClick={handleQuantityDecrease}
          className={styles.quantityButton}
          disabled={safeQuantity <= 1 || isProcessing}
        >
          –
        </button>
        <span className={styles.quantityValue}>{safeQuantity}</span>
        <button
          onClick={handleQuantityIncrease}
          className={styles.quantityButton}
          disabled={isProcessing || safeQuantity >= maxQuantity}
        >
          +
        </button>
      </div>

      <p>Total Price: ${totalPrice.toFixed(2)}</p>
      <button onClick={() => removeFromCart(CartItem.product_id, size)}>
        Remove from Cart
      </button>
    </div>
  );
};

export default CartItemCard;
