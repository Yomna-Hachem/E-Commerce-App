import React, { use, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/ProductDetails.module.css';
import ReviewCard from './ReviewCard'; 
import { useUserContext } from '../context/UserContext';
import { useCartDataContext } from '../context/CartDataContext';




const ProductDetails = () => {
  const { addToCart, isProcessing, stockMap } = useCartDataContext();  
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
  const { user } = useUserContext(); 
  const formRef = useRef(null);
  



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

  }, [id]);

  //STOCK INFO
  useEffect(() => {
    console.log('looking for sizes//,ghj,'); // Logging statement for debugging

    // Check if the stockMap contains the information for the product id
    if (stockMap) {
      const stockk = stockMap.filter(item => item.product_id === id);
      setStock(stockk);
      console.log('stock details:', stockInfo);
    } else {
      setError('Stock info not found');
    }

  }, [id, stockMap]);
 
  //REVIEW INFO
  useEffect(() => { 
    console.log('getting the damn reviews');
    fetch(`http://localhost:5001/products/reviewsInfo/${id}`)      
    .then((response) => response.json())
    .then((data) => {
      setReviewInfo(data);
      console.log('review details:', data);
    })
    .catch((err) => {
      console.error('Error fetching stocks:', err);
      setError('stock error');
    });

  }, [id]);

  useEffect(() => {
    if (selectedSize) {
      const stock = stockInfo.find(item =>
        item.size?.toLowerCase() === selectedSize.toLowerCase()
      );
      const maxQty = stock?.quantity || 1;
      setQuantity(prevQty => Math.min(prevQty, maxQty));
    } else {
      // Optional: reset to default if size is unselected
      setQuantity(1);
    }
  }, [selectedSize, stockInfo]);

  const handleSizeSelect = (size) => setSelectedSize(size);

  const handleRatingClick = (star) => setRating(star);

  const handleAddToCart = () => {
    if (user && user.user_id) {
      if (selectedSize) {
        const cartItem = {
        user_id: user.user_id,
        product_id: id,
        quantity: quantity,
        size: selectedSize,
        flag : 1
      };
      addToCart(cartItem);}
      else {
        alert('Please select a size before adding to cart.');
      }
    } else {
      console.log('User not logged in. Cannot add to cart.');
      alert('Please log in to add items to the cart.');
    }
  }
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (review.trim()) {
      setReviews([...reviews, { rating, text: review }]);
      setReview('');
      setRating(0);
    

    if (user && user.user_id) {
      //write to db
      alert('Review submitted!');
            fetch('http://localhost:5001/products/submitReview', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json', // Tell server you are sending JSON
              },
              body: JSON.stringify({
                product_id: id,          // The product id you are reviewing
                user_id: user.user_id,   // The current logged in user id
                rating: rating,         // The star rating
                comment: review         // The review text
              })
            })
            .then(response => response.json())
            .then(data => {
              console.log('Review submitted successfully', data);
              formRef.current.reset();

            })
            .catch(error => {
              console.error('Error submitting review:', error);
              formRef.current.reset();

            });
      
    } else {
      console.log('User not logged in. Cannot submit review.');
      alert('Please log in to submit a review.');
    }
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
          <h4>{user?.user_id ? user.user_id : 'Guest'}</h4>


          
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
              disabled={!selectedSize || quantity <= 1}
            >
              -
            </button>
            
            <span className={styles.quantityValue}>{quantity}</span>
            
            <button 
              onClick={() => setQuantity(prev => prev + 1)}
              className={styles.quantityButton}
              disabled={
                !selectedSize ||
                quantity >= (
                  stockInfo.find(item =>
                    item.size?.toLowerCase() === selectedSize.toLowerCase()
                  )?.quantity || 1
                )
              }
            >
              +
            </button>
          </div>


          <p>{currentProduct.description}</p>

          <button className={styles.addToCart} onClick={() => 
            handleAddToCart()} disabled={isProcessing}>{isProcessing ? 'Adding...' : 'Add to Cart'}</button>
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

        <form onSubmit={handleReviewSubmit} className={styles.reviewForm} ref={formRef}>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="3"
            placeholder="Write your review..."
            required
          />
          <button type="submit">Submit Review</button>
        </form>

        {reviewInfo.length > 0 ? (
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