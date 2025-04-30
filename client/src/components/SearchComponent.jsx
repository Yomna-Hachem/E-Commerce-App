// SearchComponent.js
import React from 'react';
import styles from '../styles/SearchPage.module.css';

import { FiSearch } from 'react-icons/fi';

const SearchComponent = ({ query, setQuery }) => {
  return (
    <div className={styles.searchForm}>
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
    </div>
  );
};

export default SearchComponent;
