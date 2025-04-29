import React, { useState } from 'react';
import styles from '../styles/Header.module.css';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useUserContext } from '../context/UserContext';

const Header = () => {
  const { user, setUserDetails } = useUserContext(); 
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    setUserDetails(null);  // Clear the user from context
    localStorage.removeItem('user');  // Remove the user from localStorage
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>MyClothingStore</div>
      <nav className={styles.nav}>
      <Link to="/search" className={styles.searchButton}>
          <FiSearch size={20} />
        </Link>

        <Link to="/products"><button>Home</button></Link>

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

        <Link to="./Cart"><button>Cart</button></Link>

        {user ? (

<div className={styles.profileDropdown}>
  {/* <img
    src={user.profile_picture || '/images/blackTshirt.jpg'}
    alt="Profile"
    className={styles.avatar}
  /> */}
  <div className={styles.dropdown}>
    <button className={styles.profileButton}>Profile</button>
    <div className={styles.dropdownContent}>
      <a href="#">View Profile</a>
      <button onClick={handleLogout}>Logout</button>
    </div>
  </div>
  </div>

    
  
) : (
  <Link to="/AuthContainer">
    <button>Sign In</button>
  </Link>
)}

      </nav>
    </header>
  );
};

export default Header;
