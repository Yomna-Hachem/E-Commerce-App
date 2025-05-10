import React, { useState, useMemo } from 'react';
import { useCartDataContext } from '../context/CartDataContext';
import { useUserContext } from '../context/UserContext';
import { useProducts } from '../context/ProductContext';
import styles from '../styles/PlaceOrder.module.css';
import { useNavigate } from 'react-router-dom';


const shippingRates = {
  'Cairo': 60,
  'Giza': 60,
  'Alexandria': 70,
  'Aswan': 100,
  'Asyut': 100,
  'Beheira': 100,
  'Beni Suef': 100,
  'Dakahlia': 90,
  'Damietta': 90,
  'Faiyum': 80,
  'Gharbia': 80,
  'Ismailia': 80,
  'Kafr El Sheikh': 70,
  'Luxor': 100,
  'Matrouh': 100,
  'Minya': 70,
  'Monufia': 70,
  'New Valley': 75,
  'North Sinai': 130,
  'Port Said': 70,
  'Qalyubia': 80,
  'Qena': 90,
  'Red Sea': 120,
  'Sharqia': 90,
  'Sohag': 100,
  'South Sinai': 120,
  'Suez': 75,
  'Helwan': 65,
  '6th of October': 60,
};


const PlaceOrder = () => {
  const { cartData, setCartData, removeFromCart, fetchStockData } = useCartDataContext();
  const { user } = useUserContext();
  const { products } = useProducts();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    user_id: user?.user_id,
    telephone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Cairo',
    postal_code: '',
    marketingOptIn: true
  });

  const [discountCode, setDiscountCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [beingPlaced, setBeingPlaced] = useState(false);

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

  const { subtotal, shipping, total, itemCount } = useMemo(() => {
    const calculatedSubtotal = cartItemsWithProducts.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
  
    const shipping = shippingRates[formData.state] ?? 0;
  
    return {
      subtotal: calculatedSubtotal,
      shipping,
      total: calculatedSubtotal + shipping,
      itemCount: cartItemsWithProducts.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
    };
  }, [cartItemsWithProducts, formData.state]);
  

  const handlePlaceOrder = async (event) => {
    event.preventDefault(); 
    setBeingPlaced(true);

    const currentSubtotal = cartItemsWithProducts.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    try {
      const payload = {
        ...formData,
        user_id: user?.user_id,
        cartData: cartItemsWithProducts,
        payment_method: paymentMethod,
        price: currentSubtotal + (shippingRates[formData.state] ?? 0)

      };

      console.log('Placing order for user 🦮');

      const response = await fetch(`http://localhost:5001/cart/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const message = await response.json();
      console.log('Order response:', message);

      cartData.forEach(item => {
        removeFromCart(item.product_id, item.size);
      });

      setCartData([]);
      fetchStockData();
      navigate("/");

    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setBeingPlaced(false);
    }
  };

  // Calculate tax as 14% of subtotal
  const tax = useMemo(() => subtotal * 0.14, [subtotal]);

  return (
    <form className={styles.container} onSubmit={handlePlaceOrder}>
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
                required
              >
                <option value="Giza">Giza</option>
                <option value="Cairo">Cairo</option>
                <option value="Alexandria">Alexandria</option>
                <option value="Aswan">Aswan</option>
                <option value="Asyut">Asyut</option>
                <option value="Beheira">Beheira</option>
                <option value="Beni Suef">Beni Suef</option>
                <option value="Dakahlia">Dakahlia</option>
                <option value="Damietta">Damietta</option>
                <option value="Faiyum">Faiyum</option>
                <option value="Gharbia">Gharbia</option>
                <option value="Ismailia">Ismailia</option>
                <option value="Kafr El Sheikh">Kafr El Sheikh</option>
                <option value="Luxor">Luxor</option>
                <option value="Matrouh">Matrouh</option>
                <option value="Minya">Minya</option>
                <option value="Monufia">Monufia</option>
                <option value="New Valley">New Valley</option>
                <option value="North Sinai">North Sinai</option>
                <option value="Port Said">Port Said</option>
                <option value="Qalyubia">Qalyubia</option>
                <option value="Qena">Qena</option>
                <option value="Red Sea">Red Sea</option>
                <option value="Sharqia">Sharqia</option>
                <option value="Sohag">Sohag</option>
                <option value="South Sinai">South Sinai</option>
                <option value="Suez">Suez</option>
                <option value="Helwan">Helwan</option>
                <option value="6th of October">6th of October</option>
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
              placeholder="Telephone"
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
            <button type="button" className={styles.discountButton}>Apply</button>
          </div>

          <div className={styles.priceBreakdown}>
          <div className={styles.priceRow}>
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>

            <div className={styles.priceRow}>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className={`${styles.priceRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>${(subtotal + shipping + tax).toFixed(2)}</span>
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

          <button 
            type="submit" 
            className={`${styles.placeOrderButton} ${beingPlaced ? styles.disabledButton : ''}`} 
            disabled={beingPlaced}
          >
            {beingPlaced ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
