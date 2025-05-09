import React, { useState, useEffect, useContext } from 'react';
import styles from '../styles/OrdersPage.module.css';
import { useProducts } from '../context/ProductContext';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { products } = useProducts();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5001/orders/allOrders', {
          credentials: 'include'
        });
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch('http://localhost:5001/orders/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          order_id: orderId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Success:', data.message);
        setOrders(orders.map(order =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        ));
        if (selectedOrder?.order_id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed': return '#FFA500';
      case 'outForDelivery': return '#4169E1';
      case 'shipped': return '#32CD32';
      case 'delivered': return '#008000';
      case 'cancelled': return '#FF0000';
      default: return '#666';
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.product_id === productId);
    return product ? product.name : `#${productId}`;
  };

  return (
    <div className={styles.container}>
      <h1>Order Management</h1>

      <div className={styles.filterControls}>
        {['all', 'placed', 'shipped', 'outForDelivery', 'delivered', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={filter === status ? styles.activeFilter : ''}
          >
            {{
              all: 'All',
              placed: 'Placed',
              shipped: 'Shipped',
              outForDelivery: 'Out for Delivery',
              delivered: 'Delivered',
              cancelled: 'Cancelled'
            }[status]}
          </button>
        ))}

      </div>

      {loading ? (
        <div className={styles.loading}>Loading orders...</div>
      ) : (
        <div className={styles.orderList}>
          {filteredOrders.length === 0 ? (
            <div className={styles.noOrders}>No orders found</div>
          ) : (
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Email</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const subtotal = parseFloat(order.subtotal_sum) || 0;
                  const tax = parseFloat(order.total_tax) || 0;
                  return (
                    <tr key={order.order_id}>
                      <td>#{order.order_id}</td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>{order.email}</td>
                      <td>{order.items?.length || 0} items</td>
                      <td>${(subtotal + tax).toFixed(2)}</td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={styles.viewButton}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedOrder && (
        <div className={styles.orderModal}>
          <div className={styles.modalContent}>
            <button
              onClick={() => setSelectedOrder(null)}
              className={styles.closeButton}
            >
              &times;
            </button>

            <div className={styles.orderDetails}>
              <div>
                <h3>Customer Email</h3>
                <p>{selectedOrder.email}</p>
              </div>

              <div>
                <h3>Items</h3>
                <table className={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map(item => (
                      <tr key={item.order_item_id}>
                        <td>{getProductName(item.product_id)}</td>
                        <td>{item.quantity}</td>
                        <td>${(parseFloat(item.price_at_purchase) || 0).toFixed(2)}</td>
                        <td>${(parseFloat(item.subtotal) || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.totalSection}>
                  <p><strong>Subtotal:</strong> ${(parseFloat(selectedOrder.subtotal_sum) || 0).toFixed(2)}</p>
                  <p><strong>Tax:</strong> ${(parseFloat(selectedOrder.total_tax) || 0).toFixed(2)}</p>
                  <p><strong>Total:</strong> ${((parseFloat(selectedOrder.subtotal_sum) || 0) + (parseFloat(selectedOrder.total_tax) || 0)).toFixed(2)}</p>
                </div>
              </div>

              <div className={styles.statusControls}>
                <h3>Update Status</h3>
                <div className={styles.statusButtons}>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.order_id, 'placed')}
                    disabled={selectedOrder.status !== 'cancelled'}
                  >
                    Mark as Placed
                  </button>

                  <button
                    onClick={() => updateOrderStatus(selectedOrder.order_id, 'shipped')}
                    disabled={selectedOrder.status !== 'placed'}
                  >
                    Mark as Shipped
                  </button>

                  <button
                    onClick={() => updateOrderStatus(selectedOrder.order_id, 'outForDelivery')}
                    disabled={selectedOrder.status !== 'shipped'}
                  >
                    Mark as Out for Delivery
                  </button>

                  <button
                    onClick={() => updateOrderStatus(selectedOrder.order_id, 'delivered')}
                    disabled={selectedOrder.status !== 'outForDelivery'}
                  >
                    Mark as Delivered
                  </button>

                  <button
                    onClick={() => updateOrderStatus(selectedOrder.order_id, 'cancelled')}
                    disabled={['cancelled', 'delivered'].includes(selectedOrder.status)}
                  >
                    Cancel Order
                  </button>

                  {/* Refund Button (Disabled) */}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
