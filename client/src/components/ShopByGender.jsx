import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ShopByGender.module.css';

const ShopByGender = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} onClick={() => handleCategoryClick('men')}>
        <h3>Shop Men</h3>
        <img
          src="/images/shop-men.jpg"
          alt="Men's Collection"
          className={styles.image}
        />
      </div>

      <div className={styles.card} onClick={() => handleCategoryClick('women')}>
        <h3>Shop Women</h3>
        <img
          src="/images/shop-women.jpg"
          alt="Women's Collection"
          className={styles.image}
        />
      </div>

      <div className={styles.card} onClick={() => handleCategoryClick('bestsellers')}>
        <h3>Best Sellers</h3>
        <img
          src="/images/bestSeller.jpg"
          alt="Best Sellers"
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default ShopByGender;
