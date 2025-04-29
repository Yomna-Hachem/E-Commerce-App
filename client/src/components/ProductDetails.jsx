import React, { use, useState, useEffect, } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/ProductDetails.module.css';
import ReviewCard from './ReviewCard'; 

const ProductDetails = () => {
  const { id } = useParams(); // <--- id from the URL /cart/:id
  const [selectedSize, setSelectedSize] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [currentProduct, setProducts] = useState([]);
  const [stockInfo, setStock] = useState([]);
  const [reviewInfo, setReviewInfo] = useState([]);
  const [quantity, setQuantity] = useState(1);


  const sizes = ['Small', 'Medium', 'Large', 'XLarge'];

  useEffect(() => {
    // Fetch product details from the backend using ProductId
    console.log('Fetching product details for ID');
    fetch(`http://localhost:5001/products/productDetails/${id}`)      
    .then((response) => response.json())
    .then((data) => {
      setProducts(data);
      console.log('Product details:', data);
    })
    .catch((err) => {
      console.error('Error fetching product:', err);
      setError('product error');
    });

  }, []);

  //STOCK INFO
  useEffect(() => { 
    console.log('looking for sizes//,ghj,');// why does it get called twice?
    fetch(`http://localhost:5001/products/stockInfo/${id}`)      
    .then((response) => response.json())
    .then((data) => {
      setStock(data);
      console.log('stock details:', data);
    })
    .catch((err) => {
      console.error('Error fetching stocks:', err);
      setError('stock error');
    });

  }, []);
 
  //REVIEW INFO
  useEffect(() => { 
    console.log('getting the damn reviews');
    fetch(`http://localhost:5001/products/reviewsInfo/${id}`)      
    .then((response) => response.json())
    .then((data) => {
      setReviewInfo(data);
      console.log('stock details:', data);
    })
    .catch((err) => {
      console.error('Error fetching stocks:', err);
      setError('stock error');
    });

  }, []);


  const handleSizeSelect = (size) => setSelectedSize(size);
  const handleRatingClick = (star) => setRating(star);
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (review.trim() && rating) {
      setReviews([...reviews, { rating, text: review }]);
      setReview('');
      setRating(0);
    }
  };

  return (
    <div className={styles.productDetails}>
      <div className={styles.productLayout}>
        <div className={styles.productImage}>
          <img src={currentProduct.image_url} alt="Product" />
        </div>

        <div className={styles.productInfo}>
          <h2>{currentProduct.name}</h2>
          <h4>${currentProduct.price}</h4>


          
          <div className={styles.sizeSelector}>
            <h5>Size</h5>
            <div className={styles.sizeButtons}>
              {sizes.map(size => (
                (() => {
                    const { quantity = 0 } = stockInfo.find(item => item.size?.toLowerCase() === size.toLowerCase()) || {};
                    const outOfStock = quantity === 0;
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      disabled={outOfStock}
                      className={`${styles.sizeButton} ${selectedSize === size ? styles.active : ''}`}
                      style={{
                        backgroundColor: outOfStock ? '#ccc' : '',
                        cursor: outOfStock ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {size} {outOfStock && '(Out of Stock)'}
                    </button>
                  );
                })()
              ))}
            </div>
          </div>

          <div className={styles.quantitySelector}>
            <button 
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className={styles.quantityButton}
            >
              -
            </button>
            
            <span className={styles.quantityValue}>{quantity}</span>
            
            <button 
              onClick={() => setQuantity(prev => prev + 1)}
              className={styles.quantityButton}
            >
              +
            </button>
          </div>


          <p>{currentProduct.description}</p>

          <button className={styles.addToCart}>Add to Cart</button>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <h3>Customer Reviews</h3>

        <div className={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => handleRatingClick(star)}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill={star <= rating ? '#ffc107' : '#e4e5e9'}
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2
                9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </div>

        <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="3"
            placeholder="Write your review..."
          />
          <button type="submit">Submit Review</button>
        </form>

        {reviews.length ? (
          reviews.map((item, idx) => (
            <div key={idx} className={styles.singleReview}>
              <div className={styles.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill={star <= item.rating ? '#ffc107' : '#e4e5e9'}
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61
                      L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    />
                  </svg>
                ))}
              </div>
              <p>{item.text}</p>
            </div>
          ))
        ) : reviewInfo.length ? (
          reviewInfo.map((review) => (
            <ReviewCard 
              key={review.review_id}
              rating={review.rating}
              comment={review.comment}
            />
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;