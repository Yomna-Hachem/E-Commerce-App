import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import styles from '../styles/Cart.module.css';
import ProductCard from './ProductCard'; // Import the ProductCard component
import {useCartDataContext} from '../context/CartDataContext'; // Import the CartDataContext
import CartItemCard from './cartItemCard'; // Import the CartItemCard component
import { useProducts } from '../context/ProductContext'; // Import the product context
import { useUserContext } from '../context/UserContext';

function Cart() {
  const { cartData, setCartData, removeFromCart } = useCartDataContext();
  const { products, loading, error } = useProducts();
  const { user, setUserDetails } = useUserContext();

  const handleCheckout = () => {
    alert('Proceeding to checkout...');
  };

  const handleEmptyCart = () => {
    if (window.confirm('Are you sure you want to empty your cart?')) {
      
      cartData.forEach(item => {
        // Use the removeFromCart function from CartContext
        removeFromCart(item.product_id, item.size);
      });
      setCartData([]);
      alert('Your cart has been emptied.');
    }
  }

  useEffect(() => {
    //console.log('Cart component mounted or updated', cartData);
  }, []);

  // Check if products are still loading or if user is not yet ready
  if (loading || !user) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <div className={styles.cart}>
      <h2>Your Cart</h2>
      <>
      <ul className={styles.cartList}>
        {cartData.map((item, index) => {
          // Find the full product info from products array
          const product = products.find(prod => prod.product_id === item.product_id);

          // If product not found (optional), you can skip or show a message
          if (!product) return null;

            return (
            <li key={index}>
              <CartItemCard CartItem={product} quantity={item.quantity} size={item.size} />
            </li>
            );
        })}
      </ul>

        <button onClick={handleCheckout}>Checkout</button>
        <button onClick={handleEmptyCart}>Empty Cart</button>
      </>
    </div>
  );
}

export default Cart;