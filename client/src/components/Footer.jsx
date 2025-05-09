import React from 'react';
import styles from '../styles/Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h2>ShopMate</h2>
          <p>Your favorite place to shop smarter.</p>
        </div>

        <div className={styles.links}>
          <div>
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/deals">Deals</Link>
          </div>

          <div>
            <h4>Support</h4>
            <p>Contact Us</p>
            <p>Email: support@shopmate.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>

          <div>
            <h4>About</h4>
            <p>Our Story</p>
            <p>Careers</p>
            <p>Blog</p>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} ShopMate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
