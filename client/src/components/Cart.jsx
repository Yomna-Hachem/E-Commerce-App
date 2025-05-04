import React, { useEffect, useState } from 'react';
import { useCartDataContext } from '../context/CartDataContext';
import { useProducts } from '../context/ProductContext';
import { useUserContext } from '../context/UserContext';
import CartItemCard from './cartItemCard';
import styles from '../styles/Cart.module.css';
import { Link } from 'react-router-dom';

function Cart() {
  const { cartData, setCartData, removeFromCart } = useCartDataContext();
  const { products, loading, error } = useProducts();
  const { user } = useUserContext();

  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);

  const handleCheckout = () => {
    setShowCheckoutPopup(true); // Open modal
  };

  const handleEmptyCart = () => {
    if (window.confirm('Are you sure you want to empty your cart?')) {
      cartData.forEach(item => {
        removeFromCart(item.product_id, item.size);
      });
      setCartData([]);
      alert('Your cart has been emptied.');
    }
  };

  const handleCancelCheckout = () => {
    setShowCheckoutPopup(false); // Close modal
  };

  const handleConfirmCheckout = () => {
    alert('Checked out!');
    setShowCheckoutPopup(false);
    // You can insert backend logic here later
  };

  const calculateTotal = () => {
    return cartData.reduce((acc, item) => {
      const product = products.find(prod => prod.product_id === item.product_id);
      if (!product) return acc;
      const price = parseFloat(product.price) || 0;
      return acc + price * item.quantity;
    }, 0);
  };

  if (loading || !user) return <div>Loading...</div>;
  if (error) return <div>Error loading products: {error.message}</div>;

  return (
    <div className={styles.cart}>
      <h2>Your Cart</h2>

      <ul className={styles.cartList}>
        {cartData.map((item, index) => {
          const product = products.find(prod => prod.product_id === item.product_id);
          if (!product) return null;
          return (
            <li key={index}>
              <CartItemCard
                CartItem={product}
                quantity={item.quantity}
                size={item.size}
                isCheckout={false}
              />
            </li>
          );
        })}
      </ul>

      <button onClick={handleCheckout}>Checkout</button>
      <button onClick={handleEmptyCart}>Empty Cart</button>

      {showCheckoutPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h3>Confirm Your Order</h3>
            <ul className={styles.cartList}>
              {cartData.map((item, index) => {
                const product = products.find(prod => prod.product_id === item.product_id);
                if (!product) return null;
                return (
                  <li key={index}>
                    <CartItemCard
                      CartItem={product}
                      quantity={item.quantity}
                      size={item.size}
                      isCheckout={true} // disable buttons in checkout mode
                    />
                  </li>
                );
              })}
            </ul>
            <p><strong>Total:</strong> ${calculateTotal().toFixed(2)}</p>
            <Link to="/order">
            <button onClick={handleConfirmCheckout}>Confirm</button>
            </Link>
            <button onClick={handleCancelCheckout}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
