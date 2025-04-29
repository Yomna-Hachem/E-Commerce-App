import React from 'react';
import styles from '../styles/ReviewCard.module.css';

const ProductReviewCard = ({ rating, comment }) => {
  //const { rating, comment } = review; // Destructure rating and comment from the review object

  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < rating ? styles.filledStar : styles.emptyStar}>
      ★
    </span>
  ));

  return (
    <div className={styles.card}>
      <div className={styles.stars}>
        {stars}
      </div>
      <p className={styles.reviewText}>
        {comment}
      </p>
    </div>
  );
};

export default ProductReviewCard;
