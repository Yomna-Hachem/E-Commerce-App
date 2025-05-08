const pool = require('../db');

const getUserOrders = async (req, res) => {
    const { userId } = req.user;
  
    try {
      const query = `
      SELECT 
      o.order_id,
      o.user_id,
      o.status,
      o.shipping_cost,
      o.created_at,
      o.address_id,
      ROUND(o.total_price::numeric, 2) AS total_price,  -- Format here
      json_agg(json_build_object(
          'order_item_id', oi.order_item_id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'size' , oi.size,
          'price_at_purchase', ROUND(oi.price_at_purchase::numeric, 2),
          'subtotal', ROUND(oi.subtotal::numeric, 2),
          'tax_amount', ROUND(oi.tax_amount::numeric, 2),
          'product_name', p.name,
          'product_image', p.image_url
      )) AS items
    FROM Orders o
    LEFT JOIN OrderItems oi ON o.order_id = oi.order_id
    LEFT JOIN Products p ON oi.product_id = p.product_id
    WHERE o.user_id = $1
    GROUP BY o.order_id
    ORDER BY o.created_at DESC;

`;

  
      const result = await pool.query(query, [userId]);
      res.json(result.rows);
      console.log(result.rows)
    } catch (err) {
      console.error('Error fetching user orders:', err);
      res.status(500).json({ error: 'Failed to fetch user orders' });
    }
  };
  
  
  
  const getAllOrders = async (req, res) => {
    try {
      const query = `
        SELECT o.*,
               u.email,
               COALESCE(SUM(oi.subtotal), 0) AS subtotal_sum,
               COALESCE(SUM(oi.tax_amount), 0) AS total_tax,
               json_agg(json_build_object(
                 'order_item_id', oi.order_item_id,
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'price_at_purchase', oi.price_at_purchase,
                 'subtotal', oi.subtotal,
                 'tax_amount', oi.tax_amount
               )) AS items
        FROM Orders o
        LEFT JOIN OrderItems oi ON o.order_id = oi.order_id
        LEFT JOIN Users u ON o.user_id = u.user_id
        GROUP BY o.order_id, u.email
        ORDER BY o.created_at DESC;
      `;
  
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching all orders:', err);
      res.status(500).json({ error: 'Failed to fetch all orders' });
    }
  };

  
const updateOrderStatus = async (req, res) => {
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    await pool.query('BEGIN');

    // Step 1: Check if order exists and is in 'placed' status
    const orderCheck = await pool.query(
      'SELECT status FROM orders WHERE order_id = $1',
      [orderId]
    );

    if (orderCheck.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }

    const status = orderCheck.rows[0].status;
    if (status !== 'placed') {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Only placed orders can be canceled' });
    }

    // Step 2: Get the order items
    const orderItems = await pool.query(
      'SELECT product_id, size, quantity FROM orderitems WHERE order_id = $1',
      [orderId]
    );

    // Step 3: Restore product stock for each item
    for (const item of orderItems.rows) {
      await pool.query(
        `
        UPDATE product_stock
        SET quantity = quantity + $1
        WHERE product_id = $2 AND size = $3
        `,
        [item.quantity, item.product_id, item.size]
      );
    }

    // Step 4: Mark order as cancelled
    await pool.query(
      `UPDATE orders SET status = 'cancelled' WHERE order_id = $1`,
      [orderId]
    );

    await pool.query('COMMIT');
    res.status(200).json({ message: 'Order cancelled and stock restored successfully' });

  } catch (err) {
    console.error('Error cancelling order:', err);
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Internal server error' });
  }
};


const db = require('../db'); // adjust path if needed

const requestRefund = async (req, res) => {
  const { orderId } = req.params;
  const {userId} = req.user;
  const{customer_explanation} = req.body
  console.log("orderId")
  console.log(orderId)
  console.log("userId")
  console.log(userId)
  console.log("explanation")
  console.log(customer_explanation)

  try {
    // 1. Ensure the order belongs to the user
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE order_id = $1 AND user_id = $2',
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found or not owned by user' });
    }

    const order = orderResult.rows[0];

    // 2. Prevent duplicate refund requests
    if (['refundPending', 'Refunded', 'RefundRejected'].includes(order.status)) {
      return res.status(400).json({ message: 'Refund already requested or processed' });
    }

    // 3. Insert refund record (you can add a reason field if needed)
    await db.query(
      'INSERT INTO refunds (order_id, requested_at, customer_explanation) VALUES ($1, NOW(), $2)',
      [orderId, customer_explanation]
    );

    // 4. Update the order status to refundPending
    await db.query(
      'UPDATE orders SET status = $1 WHERE order_id = $2',
      ['refundPending', orderId]
    );

    res.status(200).json({ message: 'Refund request submitted successfully' });

  } catch (err) {
    console.error('Error submitting refund request:', err);
    res.status(500).json({ message: 'Server error while requesting refund' });
  }
};



module.exports= {getUserOrders, getAllOrders, updateOrderStatus, cancelOrder, requestRefund};

