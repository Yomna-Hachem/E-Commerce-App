import React, { useState } from 'react';
import styles from '../styles/Header.module.css';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const Header = () => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchClick = () => {
    setShowSearchInput(prev => !prev);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>MyClothingStore</div>
      <nav className={styles.nav}>
      <Link to="/search" className={styles.searchButton}>
          <FiSearch size={20} />
        </Link>

        <Link to="./products"><button>Home</button></Link>

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

        <div className={styles.searchContainer}>
          {showSearchInput && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              placeholder="Search products..."
              autoFocus
            />
          )}
          {/* <button
            className={styles.searchButton}
            onClick={handleSearchClick}
          >
            Search <FiSearch size={18} />
          </button> */}
        </div>


        <Link to="./Cart"><button>Cart</button></Link>
        <Link to="./AuthContainer"><button>Sign In</button></Link>
      </nav>
    </header>
  );
};

export default Header;
