// SearchPage.js
import React, { useState } from 'react';
import styles from '../styles/SearchPage.module.css';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard'; 
import SearchComponent from '../components/SearchComponent';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const { products, loading } = useProducts();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* SearchComponent for handling the search input */}
      <SearchComponent query={query} setQuery={setQuery} />

      <div className={styles.productGrid}>
        {loading ? (
          <p>Loading products...</p>
        ) : query === '' ? (
          <p>Start typing to search for products...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
