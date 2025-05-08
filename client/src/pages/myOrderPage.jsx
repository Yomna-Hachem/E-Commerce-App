import React, { useEffect, useState } from 'react';
import styles from '../styles/UserOrders.module.css';
import { ProgressBar, Button, Accordion } from 'react-bootstrap';

const OrderProgress = ({ status }) => {
  const progressStages = ['placed', 'shipped', 'out_for_delivery', 'delivered'];
  const currentStep = progressStages.indexOf(status);
  const progress = (currentStep / (progressStages.length - 1)) * 100;

  return (
    <ProgressBar now={progress} label={status.replace(/_/g, ' ')} className={styles.orderProgress} />
  );
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5001/myOrderPage');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };
    fetchOrders();
  }, []);

  const activeOrders = orders.filter(order => order.status !== 'delivered');
  const pastOrders = orders.filter(order => order.status === 'delivered');

  const renderOrder = (order) => (
    <div key={order.order_id} className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <h3>Order #{order.order_id.slice(0, 8)}</h3>
        <p>Status: {order.status.replace(/_/g, ' ')}</p>
        {order.status !== 'delivered' && <OrderProgress status={order.status} />}
        {order.status === 'delivered' && <Button className={styles.refundBtn}>Request Refund</Button>}
      </div>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Order Items</Accordion.Header>
          <Accordion.Body>
            {order.items.map(item => (
              <div key={item.order_item_id} className={styles.orderItem}>
                <p><strong>Product:</strong> {item.product_id}</p>
                <p><strong>Qty:</strong> {item.quantity}</p>
                <p><strong>Price:</strong> ${item.price_at_purchase}</p>
              </div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );

  return (
    <div className={styles.userOrders}>
      <h2 className={styles.sectionTitle}>Active Orders</h2>
      {activeOrders.length ? activeOrders.map(renderOrder) : <p>No active orders.</p>}

      <h2 className={styles.sectionTitle}>Order History</h2>
      {pastOrders.length ? pastOrders.map(renderOrder) : <p>No past orders.</p>}
    </div>
  );
};

export default UserOrders;
