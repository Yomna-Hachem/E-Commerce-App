const pool = require('../db');

const getUserOrders = async (req, res) => {
    const { userId } = req.user;
  
    try {
      const query = `
        SELECT o.*,
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
        WHERE o.user_id = $1
        GROUP BY o.order_id
        ORDER BY o.created_at DESC;
      `;
  
      const result = await pool.query(query, [userId]);
      res.json(result.rows);
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

module.exports= {getUserOrders, getAllOrders};

