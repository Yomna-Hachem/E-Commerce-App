import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import styles from '../styles/Cart.module.css';
import ProductCard from './ProductCard'; // Import the ProductCard component

function Cart() {
  const { cartItems, emptyCart, setViewMode } = useCart();

  const handleCheckout = () => {
    alert('Proceeding to checkout...');
    // Implement further checkout logic here
  };

  useEffect(() => {
    setViewMode('cart'); // Set view mode to 'cart'
  }, [setViewMode]);

  return (
    <div className={styles.cart}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {/* Loop through each item in cartItems and render ProductCard */}
            {cartItems.map((item, index) => (
              <li key={index}>
                <ProductCard product={item} /> {/* Pass each cart item to ProductCard */}
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout}>Checkout</button>
          <button onClick={emptyCart}>Empty Cart</button>
        </>
      )}
    </div>
  );
}

export default Cart;
