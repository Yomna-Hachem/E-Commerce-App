const pool = require('../db');

const getCartData = async (req, res) => {
    const { user_id } = req.params; // <-- GET ID from URL params
    try {
      const result = await pool.query(
        'SELECT user_id, product_id, quantity, size FROM cartitems WHERE user_id = $1', 
        [user_id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

const addToCart = async (req, res) => {
    const { user_id, product_id, quantity, size, flag } = req.body; // Assuming you're sending these in the request body
    try {
      const result = await pool.query(`
        INSERT INTO "cartitems" ("user_id", "product_id", "quantity", "size", "added_at")
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT ("user_id", "product_id", "size")
        DO UPDATE SET 
          "quantity" = CASE 
                        WHEN $5 = 1 THEN cartitems."quantity" + EXCLUDED."quantity"
                        ELSE GREATEST(cartitems."quantity" - EXCLUDED."quantity", 1)
                      END,
          "added_at" = NOW();
      `, [user_id, product_id, quantity, size, flag]);
      res.json({ message: 'Item added to cart successfully!' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };


const removeFromCart = async (req, res) => {
    const { user_id, product_id, size } = req.body; // Assuming you're sending these in the request body
    try {
      const result = await pool.query(
        'DELETE FROM cartitems WHERE user_id = $1 AND product_id = $2 AND size = $3',
        [user_id, product_id, size]
      );
      res.json({ message: 'Item removed from cart successfully!' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

module.exports = {getCartData, addToCart, removeFromCart};