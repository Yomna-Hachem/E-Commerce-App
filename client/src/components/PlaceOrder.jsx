import React, { useState, useMemo, use } from 'react';
import { useCartDataContext } from '../context/CartDataContext';
import { useUserContext } from '../context/UserContext';
import { useProducts } from '../context/ProductContext';
import styles from '../styles/PlaceOrder.module.css';

const PlaceOrder = () => {
  const { cartData } = useCartDataContext();
  const { user } = useUserContext();
  const { products } = useProducts();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    user_id: user?.user_id,
    telephone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Giza',
    postal_code: '',
    price : 0,
    marketingOptIn: true
  });

  const [discountCode, setDiscountCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const cartItemsWithProducts = useMemo(() => {
    return cartData.map(cartItem => {
      const product = products.find(p => p.product_id === cartItem.product_id);
      return {
        ...cartItem,
        name: product?.name || 'Unknown Product',
        price: product?.price || 0,
        image_url: product?.image_url || ''
      };
    });
  }, [cartData, products]);

  const { subtotal, total, itemCount } = useMemo(() => {
    const calculatedSubtotal = cartItemsWithProducts.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    return {
      subtotal: calculatedSubtotal,
      total: calculatedSubtotal,
      itemCount: cartItemsWithProducts.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
    };
  }, [cartItemsWithProducts]);



const handlePlaceOrder = async () => {
  const currentSubtotal = cartItemsWithProducts.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);
    try {
      setFormData(prev => ({
        ...prev,
        user_id: user?.user_id,
        price: currentSubtotal
      }));
        const payload = {
            ...formData,
            cartData: cartItemsWithProducts  // make sure it's fresh
          };
        console.log('Placing order for user 🦮');
        const response = await fetch(`http://localhost:5001/cart/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log('Order placed successfully:', data);
    } catch (error) {
        console.error('Error placing order:', error);
    }
};

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h2 className={styles.sectionHeading}>Contact</h2>
        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="Email"
            required
          />
        </div>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="marketingOptIn"
            checked={formData.marketingOptIn}
            onChange={handleInputChange}
            className={styles.checkboxInput}
          />
          Email me with news and offers
        </label>

        <h2 className={styles.sectionHeading}>Delivery</h2>

        <div className={styles.nameFields}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={styles.inputField}
              placeholder="First name"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={styles.inputField}
              placeholder="Last name"
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="Address"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="apartment"
            value={formData.apartment}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="Apartment, suite, etc. (optional)"
          />
        </div>

        <div className={styles.locationFields}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={styles.inputField}
              placeholder="City"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <select 
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={styles.selectField}
            >
              <option value="Giza">Giza</option>
              <option value="Cairo">Cairo</option>
            </select>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="Postal code (optional)"
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="telephone"
            required
          />
        </div>
      </div>

      <div className={styles.summarySection}>
        <h2 className={styles.sectionHeading}>Order Summary</h2>
        <div className={styles.cartItems}>
          {cartItemsWithProducts.map((item, index) => (
            <div key={`${item.product_id}-${item.size}-${index}`} className={styles.cartItem}>
              <span className={styles.itemQuantity}>{item.quantity}x</span>
              <span className={styles.itemSize}>{item.size}</span>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemPrice}>${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</span>
              <div className={styles.itemDivider}></div>
            </div>
          ))}
        </div>

        <div className={styles.discountGroup}>
          <input
            type="text"
            placeholder="Discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className={styles.discountInput}
          />
          <button type="button" className={styles.discountButton} >Apply</button>
        </div>

        <div className={styles.priceBreakdown}>
          <div className={styles.priceRow}>
            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.priceRow}>
            <span>Shipping</span>
            <span>$0 FREE</span>
          </div>
          <div className={`${styles.priceRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.savingsNotice}>
          TOTAL SAVINGS $95.00
        </div>

        <h2 className={styles.sectionHeading}>Payment Method</h2>
        <div className={styles.paymentOptions}>
          <label className={styles.paymentOption}>
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={paymentMethod === 'credit_card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={styles.radioInput}
            />
            Credit Card
          </label>
          <label className={styles.paymentOption}>
            <input
              type="radio"
              name="paymentMethod"
              value="cash_on_delivery"
              checked={paymentMethod === 'cash_on_delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={styles.radioInput}
            />
            Cash on Delivery
          </label>
        </div>

        <button type="submit" className={styles.placeOrderButton} onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
