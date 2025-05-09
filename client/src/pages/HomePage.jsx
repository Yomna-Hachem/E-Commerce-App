import React from 'react';
import styles from '../styles/HomePage.module.css';
import Slideshow from '../components/SlideShow';
import ShopByGender from '../components/ShopByGender';
import ProductList from '../components/ProductList';



function HomePage () {
  return (
    
    <div className={styles.container}>
      <Slideshow />
      <ShopByGender />

    </div> 

  );
}; 

export default HomePage;
