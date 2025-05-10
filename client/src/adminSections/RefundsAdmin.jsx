import React, { useState, useEffect } from 'react';
import styles from '../styles/RefundsPage.module.css';
import { useProducts } from '../context/ProductContext';

const RefundManagement = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRefund, setSelectedRefund] = useState(null);
  const { products } = useProducts();

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const response = await fetch('http://localhost:5001/orders/allOrdersRefunds', {
          credentials: 'include',
        });
        const data = await response.json();
        setRefunds(data);
        console.log('Refunds:', data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching refunds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  const filteredRefunds = filter === 'all'
    ? refunds
    : refunds.filter(refund => refund.refunds?.[0]?.status === filter);

  const updateRefundStatus = async (refundId, newStatus) => {
    try {
      const response = await fetch('http://localhost:5001/orders/updateStatusRefunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ order_id: refundId, status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update refund list using prev =>
        setRefunds(prev => prev.map(refund => {
          if (refund.order_id === refundId) {
            return {
              ...refund,
              refunds: [{ ...refund.refunds[0], status: newStatus }],
            };
          }
          return refund;
        }));
        if (selectedRefund?.order_id === refundId) {
          setSelectedRefund(prev => ({
            ...prev,
            refunds: [{ ...prev.refunds[0], status: newStatus }],
          }));
        }
        
      } else {
        console.error('Error updating refund:', data.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const getStatusColor = (status) => {
    switch (status) {
      case 'refundPending': return '#FFA500';
      case 'refunded': return '#32CD32';
      case 'RefundRejected': return '#FF0000';
      default: return '#666';
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.product_id === productId);
    return product ? product.name : `#${productId}`;
  };

  return (
    <div className={styles.container}>
      <h1>Refund Management</h1>

      <div className={styles.filterControls}>
        {['all', 'refundPending', 'refunded', 'RefundRejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={filter === status ? styles.activeFilter : ''}
          >
            {{
              all: 'All',
              refundPending: 'Refund Requested',
              refunded: 'Refunded',
              RefundRejected: 'Refund Rejected',
            }[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading refunds...</div>
      ) : (
        <div className={styles.refundList}>
          {filteredRefunds.length === 0 ? (
            <div className={styles.noRefunds}>No refunds found</div>
          ) : (
            <table className={styles.refundsTable}>
              <thead>
                <tr>
                  <th>Refund ID</th>
                  <th>Date</th>
                  <th>Email</th>
                  <th>Items</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRefunds.map(refund => (
                  <tr key={refund.refunds?.[0]?.refund_id || refund.order_id}>
                    <td>#{refund.refunds?.[0]?.refund_id || 'N/A'}</td>
                    <td>{formatDate(refund.created_at)}</td>
                    <td>{refund.email}</td>
                    <td>{refund.items?.length || 0} items</td>
                    <td>{refund.refunds?.[0]?.customer_explanation || 'N/A'}</td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(refund.refunds?.[0]?.status) }}
                      >
                        {refund.refunds?.[0]?.status || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedRefund(refund)}
                        className={styles.viewButton}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedRefund && (
        <div className={styles.refundModal}>
          <div className={styles.modalContent}>
            <button
              onClick={() => setSelectedRefund(null)}
              className={styles.closeButton}
            >
              &times;
            </button>

            <div className={styles.refundDetails}>
              <div>
                <h3>Customer Email</h3>
                <p>{selectedRefund.email}</p>
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
                    {selectedRefund.items?.map(item => (
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
                  <p><strong>Reason:</strong> {selectedRefund.refunds?.[0]?.customer_explanation || 'N/A'}</p>
                </div>
              </div>

              <div className={styles.statusControls}>
                <h3>Update Status</h3>
                <div className={styles.statusButtons}>
                  <button
                    onClick={() => updateRefundStatus(selectedRefund.order_id, 'refunded')}
                    disabled={selectedRefund.refunds?.[0]?.status === 'refunded'}
                  >
                    Mark as Refunded
                  </button>
                  <button
                    onClick={() => updateRefundStatus(selectedRefund.order_id, 'RefundRejected')}
                    disabled={selectedRefund.refunds?.[0]?.status === 'RefundRejected'}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateRefundStatus(selectedRefund.order_id, 'refundPending')}
                    disabled={selectedRefund.refunds?.[0]?.status === 'refundPending'}
                  >
                    Mark as Pending
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundManagement;
