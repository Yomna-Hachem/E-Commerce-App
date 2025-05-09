import React, { useState, useEffect } from 'react';
import styles from '../styles/AdminMainPage.module.css';
import { useUserContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

import Dashboard from '../adminSections/DashboardAdmin';
import Orders from '../adminSections/OrdersAdmin';
import Products from '../adminSections/ProductsAdmin';
import Promotions from '../adminSections/PromotionsAdmin';
import AddProduct from '../adminSections/AddProduct';
import UpdateProduct from '../adminSections/UpdateProduct';
import RefundManagement from '../adminSections/RefundsAdmin';
// import AddPromotion from '../adminSections/AddPromotionAdmin';
// import UpdatePromotion from '../adminSections/UpdatePromotionAdmin';
// import UpdateOrder from '../adminSections/UpdateOrderAdmin';


function AdminMainPage() {
  const { user, isLoading } = useUserContext();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch('http://localhost:5001/admin', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (user?.role !== 'admin') return <Navigate to="/unauthorized" />;

  const renderSection = () => {
    if (activeSection.startsWith('updateProduct-')) {
      const productId = activeSection.split('-')[1]; // Extract product ID from activeSection
      return <UpdateProduct productId={productId} />; // Pass productId as a prop
    }

    switch (activeSection) {
      case 'products': return <Products  setActiveSection={setActiveSection}/>;
      case 'promotions': return <Promotions />;
      case 'addProduct': return <AddProduct />;
      case 'refunds': return <RefundManagement />;
      case 'orders': return <Orders setActiveSection={setActiveSection} />;
      default: return <Dashboard />;
    
    }
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.topHeader}>
        <h1 className={styles.logo}>Admin Panel</h1>
        <p className={styles.userInfo}>Welcome, {user?.first_name || 'Admin'}</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <ul>
            <li onClick={() => setActiveSection('dashboard')}>Dashboard</li>
            <li onClick={() => setActiveSection('orders')}>Order Management</li>
            <li onClick={() => setActiveSection('refunds')}>Refunds Management</li>
            <li onClick={() => setActiveSection('products')}>Product Management</li>
            <li onClick={() => setActiveSection('promotions')}>Promotions</li>

          </ul>
        </aside>

        <main className={styles.mainContent}>{renderSection()}</main>
      </div>
    </div>
  );
}

export default AdminMainPage;
