import React, { useEffect, useState } from 'react';
import styles from '../styles/UserOrders.module.css';
import { ProgressBar, Button, Accordion, Modal, Form } from 'react-bootstrap';
import ConfirmationComponent from '../components/confirmationComponent';

const OrderProgress = ({ status }) => {
  const progressStages = ['placed', 'shipped', 'outForDelivery', 'delivered'];
  const noProgressStatuses = ['cancelled', 'Refunded', 'RefundRejected', 'refundPending'];

  if (noProgressStatuses.includes(status)) {
    return null;
  }

  const currentStep = progressStages.indexOf(status);
  const progress = ((currentStep + 1) / progressStages.length) * 100;

  return (
    <ProgressBar
      now={progress}
      label={status.replace(/_/g, ' ')}
      className={styles.orderProgress}
    />
  );
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5001/orders/myOrders', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const handleRefundRequest = async () => {
    try {
      const response = await fetch(`http://localhost:5001/orders/requestRefund/${selectedOrderId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_explanation: refundReason }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to request refund');
      }
  
      setOrders(prev =>
        prev.map(order =>
          order.order_id === selectedOrderId ? { ...order, status: 'refundPending' } : order
        )
      );
      setShowReasonModal(false);
      setRefundReason('');
    } catch (err) {
      console.error('Failed to request refund:', err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5001/orders/cancel/${orderId}`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      setOrders(prev =>
        prev.map(order =>
          order.order_id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
    } catch (err) {
      console.error('Failed to cancel order:', err);
    }
  };

  const activeOrders = orders.filter(
    order => !['delivered', 'cancelled', 'Refunded', 'RefundRejected'].includes(order.status)
  );
  const pastOrders = orders.filter(
    order => ['delivered', 'cancelled', 'Refunded', 'RefundRejected'].includes(order.status)
  );

  const renderOrder = (order) => (
    <div key={order.order_id} className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <h3>Order #{order.order_id.slice(0, 8)}</h3>
        <div className={styles.orderMeta}>
          <p>Status: <span className={styles.statusText}>{order.status.replace(/_/g, ' ')}</span></p>
          <p>Total: <span className={styles.priceText}>${order.total_price}</span></p>
          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <OrderProgress status={order.status} />
        <div className={styles.orderActions}>
          {order.status === 'placed' && (
            <Button
              variant="danger"
              onClick={() => {
                setSelectedOrderId(order.order_id);
                setShowConfirm(true);
              }}
              className={styles.cancelBtn}
            >
              Cancel Order
            </Button>
          )}
          {['delivered', 'refundPending', 'Refunded', 'RefundRejected'].includes(order.status) && (
            <Button
              variant={order.status === 'RefundRejected' ? 'danger' : 'primary'}
              className={`${styles.actionBtn} ${
                order.status === 'Refunded' ? styles.refundedBtn : 
                order.status === 'RefundRejected' ? styles.rejectedBtn : ''
              }`}
              disabled={order.status !== 'delivered'}
              onClick={() => {
                if (order.status === 'delivered') {
                  setSelectedOrderId(order.order_id);
                  setShowRefundConfirm(true);
                }
              }}
            >
              {order.status === 'delivered' && 'Request Refund'}
              {order.status === 'refundPending' && 'Refund Pending'}
              {order.status === 'Refunded' && 'Refunded'}
              {order.status === 'RefundRejected' && 'Refund Rejected'}
            </Button>
          )}

          {(order.status !== 'placed' && order.status !== 'delivered') && (
            <Button variant="danger" disabled className={styles.cancelBtn}>
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Order Details</Accordion.Header>
          <Accordion.Body>
            <div className={styles.orderSummary}>
              <p>Subtotal: ${(order.total_price - order.shipping_cost).toFixed(2)}</p>
              <p className={styles.totalPrice}>Total: ${order.total_price}</p>
            </div>
            {order.items.map(item => (
              <div key={item.order_item_id} className={styles.orderItem}>
                <div className={styles.productImageContainer}>
                  <img src={item.product_image} alt={item.product_name} className={styles.productImage} />
                </div>
                <div className={styles.productDetails}>
                  <p><strong>Product:</strong> {item.product_name}</p>
                  <p><strong>Size:</strong> {item.size}</p>
                  <p><strong>Qty:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> ${item.price_at_purchase}</p>
                  <p><strong>Subtotal:</strong> ${item.subtotal}</p>
                </div>
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

      <ConfirmationComponent
        show={showConfirm}
        message="Are you sure you want to cancel this order?"
        onYes={() => {
          if (selectedOrderId) {
            handleCancelOrder(selectedOrderId);
          }
          setShowConfirm(false);
          setSelectedOrderId(null);
        }}
        onNo={() => {
          setShowConfirm(false);
          setSelectedOrderId(null);
        }}
      />

      <ConfirmationComponent
        show={showRefundConfirm}
        message="Are you sure you want to request a refund for this order?"
        onYes={() => {
          setShowRefundConfirm(false);
          setShowReasonModal(true);
        }}
        onNo={() => {
          setShowRefundConfirm(false);
          setSelectedOrderId(null);
        }}
      />

      <Modal show={showReasonModal} onHide={() => setShowReasonModal(false)} className={styles.refundModal}>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title>Refund Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <Form.Group controlId="refundReason">
            <Form.Label>Please explain why you're requesting a refund:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className={styles.reasonInput}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={() => setShowReasonModal(false)} className={styles.modalCancelBtn}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRefundRequest} className={styles.modalSubmitBtn}>
            Submit Refund Request
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserOrders;