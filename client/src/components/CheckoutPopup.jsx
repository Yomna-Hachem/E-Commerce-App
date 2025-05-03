import React from 'react';
import CartItemCard from './cartItemCard'; // Adjust path as needed
import { useCartDataContext } from '../context/CartDataContext';
import styles from '../styles/CheckoutPopup.module.css';

const CheckoutPopup = ({ onClose, onConfirm }) => {
  const { cartDataItems } = useCartDataContext();

  const total = cartDataItems.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return acc + price * quantity;
  }, 0);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Checkout Summary</h2>

        <div className={styles.itemsContainer}>
          {cartDataItems.map((item, idx) => (
            <CartItemCard
              key={`${item.product_id}-${item.size}-${idx}`}
              CartItem={item}
              quantity={item.quantity}
              size={item.size}
              isCheckout={true}
            />
          ))}
        </div>

        <div className={styles.totalSection}>
          <h3>Total: ${total.toFixed(2)}</h3>
        </div>

        <div className={styles.actions}>
          <button onClick={onConfirm} className={styles.confirm}>Checkout</button>
          <button onClick={onClose} className={styles.cancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;
