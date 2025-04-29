import React, { useState } from 'react';
import styles from '../styles/SearchPage.module.css'; // You can create this CSS file
import { FiSearch } from 'react-icons/fi';

const SearchPage = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // We'll implement filtering/fetching in a later step
    console.log('Searching for:', query);
  };

  return (
    <div className={styles.searchPage}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchSubmit}>
          <FiSearch />
        </button>
      </form>
    </div>
  );
};

export default SearchPage;
