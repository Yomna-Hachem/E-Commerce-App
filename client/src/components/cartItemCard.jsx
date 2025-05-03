import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/CartItemCard.module.css';
import { useCartDataContext } from '../context/CartDataContext';
import { useUserContext } from '../context/UserContext';

const CartItemCard = ({ CartItem, quantity, size, isCheckout = false }) => {
  const { removeFromCart, addToCart, isProcessing, stockMap } = useCartDataContext();
  const [safeQuantity, setSafeQuantity] = useState(parseInt(quantity) || 0);
  const { user } = useUserContext();
  const [, forceUpdate] = useState(0);
  const hasRun = useRef(false);

  const safePrice = parseFloat(CartItem?.price) || 0;
  const totalPrice = safePrice * safeQuantity;

  const maxQuantity = stockMap?.find(
    (item) =>
      item.product_id === CartItem.product_id &&
      item.size?.toLowerCase() === size.toLowerCase()
  )?.quantity;

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!isCheckout && safeQuantity > maxQuantity) {
      const tempCartItemForMax = {
        user_id: user.user_id,
        product_id: CartItem.product_id,
        quantity: safeQuantity - maxQuantity,
        size: size,
        flag: 0
      };
      addToCart(tempCartItemForMax);
      setSafeQuantity(maxQuantity);
    }
  }, [maxQuantity, safeQuantity, isCheckout]);

  useEffect(() => {
    forceUpdate(prev => prev + 1);
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
        {!isCheckout && (
          <>
            <button
              onClick={handleQuantityDecrease}
              className={styles.quantityButton}
              disabled={safeQuantity <= 1 || isProcessing}
            >
              -
            </button>
            </>
          )}
            <span className={styles.quantityValue}>{isCheckout && "Quantity:"} {safeQuantity}</span>
            <>
            {!isCheckout && (
            <button
              onClick={handleQuantityIncrease}
              className={styles.quantityButton}
              disabled={isProcessing || safeQuantity >= maxQuantity}
            >
              +
            </button>
            )}
          </>
        
      </div>
  

      <p>Total Price: ${totalPrice.toFixed(2)}</p>
      <button
        onClick={() => removeFromCart(CartItem.product_id, size)}
        
      >
        {isCheckout ? 'Remove from Checkout' : 'Remove from Cart'}
      </button>
    </div>
  );
};

export default CartItemCard;
