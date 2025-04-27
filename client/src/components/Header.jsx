import React from 'react';
import styles from '../styles/Header.module.css';
import {Link } from 'react-router-dom';



const Header = () => {


  return (
    <header className={styles.header}>
      <div className={styles.logo}>MyClothingStore</div>
      <nav className={styles.nav}>
        <Link to = "./products"><button>Home</button> </Link>
        <div className={styles.dropdown}>
          <button>Shop</button>
          <div className={styles.dropdownContent}>
            <a href="#">Men</a>
            <a href="#">Women</a>
            <a href="#">Sportswear</a>
            <a href="#">Bestsellers</a>
            <a href="#">New Arrivals</a>
            <a href="#">Sale</a>
          </div>
        </div>
        <button>Search</button>
        <Link to = "./Cart"><button>Cart</button></Link>
        <Link to ="./AuthContainer" > <button> Sign In</button> </Link>
        {/* <button onClick={handleSignInClick}>Sign In</button> */}
      </nav>
    </header>
  );
};

export default Header;
