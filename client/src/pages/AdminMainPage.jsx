import React, { useState, useEffect } from 'react';
import styles from '../styles/AdminMainPage.module.css';
import { useUserContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

function AdminMainPage() {
  const { user, isLoading } = useUserContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/admin', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.topHeader}>
        <h1 className={styles.logo}>Admin Panel</h1>
        <div className={styles.userInfo}>
          <p>Welcome, {user?.first_name || 'Admin'}</p>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav>
            <ul>
              <li>Dashboard</li>
              <li>Order Management</li>
              <li>Product Catalog</li>
              <li>Inventory Management</li>
              <li>Promotions</li>
            </ul>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          <h2>Dashboard</h2>
          <p>Manage orders, products, inventory, and promotions from the menu.</p>
          <div className={styles.widgets}>
            <div className={styles.widget}>Orders</div>
            <div className={styles.widget}>Products</div>
            <div className={styles.widget}>Inventory</div>
            <div className={styles.widget}>Promotions</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminMainPage;
