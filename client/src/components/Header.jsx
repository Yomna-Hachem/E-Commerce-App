import React, { useState } from 'react';
import styles from '../styles/Header.module.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useUserContext } from '../context/UserContext';

const Header = () => {
  const { user, setUserDetails, isLoading } = useUserContext(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // ✅ Get current route
  const navigate = useNavigate();

  // ✅ Hide Header on /admin page
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    setUserDetails(null);
    localStorage.removeItem('user');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const handleNavItemClick = () => setIsMenuOpen(false);

  const handleCategoryClick = (category) => {
    setIsMenuOpen(false);
    navigate(`/products?category=${category}`);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Luxe & Co.</div>

      <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.showMenu : ''}`}>
        <Link to="/search" className={styles.searchButton} onClick={handleNavItemClick}>
          <FiSearch size={20} />
        </Link>

        <Link to="/" onClick={handleNavItemClick}>
          <button>Home</button>
        </Link>

        <div className={styles.dropdown}>
          <Link to="/products" onClick={handleNavItemClick}><button>Shop</button></Link>
          <div className={styles.dropdownContent}>
            <a onClick={() => handleCategoryClick('men')}>Men</a>
            <a onClick={() => handleCategoryClick('women')}>Women</a>
            <a onClick={() => handleCategoryClick('sportswear')}>Sportswear</a>
            <a onClick={() => handleCategoryClick('bestsellers')}>Bestsellers</a>
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
                  src={user.profile_picture}
                  alt="User Profile"
                  className={styles.profileImage}
                />
                {user.first_name}
              </button>
              <div className={styles.dropdownContent}>
                <Link to="/profile">View Profile</Link>
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