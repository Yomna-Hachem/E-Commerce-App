import React, { useState} from 'react';
import styles from '../styles/Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useUserContext } from '../context/UserContext';

const Header = () => {
  const { user, setUserDetails } = useUserContext(); 
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setUserDetails(null);
    localStorage.removeItem('user');
    setIsMenuOpen(false); // collapse menu after logout
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);


  const handleNavItemClick = () => {
    setIsMenuOpen(false);
  };

  const navigate = useNavigate();
  const handleCategoryClick = (category) => {
    setIsMenuOpen(false);
    navigate(`/products?category=${category}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>My Clothing Store</div>

      <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Nav */}
      <nav className={`${styles.nav} ${isMenuOpen ? styles.showMenu : ''}`}>
        <Link to="/search" className={styles.searchButton} onClick={handleNavItemClick}>
          <FiSearch size={20} />
        </Link>

        <Link to="/" onClick={handleNavItemClick}>
          <button>Home</button>
        </Link>

        <div className={styles.dropdown}>
        <Link to="/products" onClick={handleNavItemClick}><button>Shop</button> </Link>
        <div className={styles.dropdownContent}>
          <a onClick={() => handleCategoryClick('men')}>Men</a>
          <a onClick={() => handleCategoryClick('women')}>Women</a>
          <a onClick={() => handleCategoryClick('sportswear')}>Sportswear</a>
          <a onClick={() => handleCategoryClick('bestsellers')}>Bestsellers</a>
          <a onClick={() => handleCategoryClick('new')}>New Arrivals</a>
        </div>
        </div>

        <Link to="/Cart" onClick={handleNavItemClick}>
          <button>Cart</button>
        </Link>

        {user ? (
          <div className={styles.profileDropdown}>
          <div className={styles.dropdown}>
            <button className={styles.profileButton}>
              <img
                src={user.profile_picture} // Make sure user.image_url exists and is valid
                alt="User Profile"
                className={styles.profileImage}
              />
              {user.first_name}
            </button>
            <div className={styles.dropdownContent}>
              <a href="#" onClick={handleNavItemClick}>View Profile</a>
              <a onClick={handleLogout}>Logout</a>
            </div>
          </div>
        </div>
        
        ) : (
          <Link to="/AuthContainer" onClick={handleNavItemClick}>
            <button>Sign In</button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
