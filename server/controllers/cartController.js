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

  const placeOrder = async (req, res) => {
    console.log('Placing order...');
    const formData = req.body;
    try {
    await pool.query('BEGIN');
   
    const result = await pool.query(
      `
      INSERT INTO "shippingaddresses" (
        "user_id",
        "address",
        "apartment",
        "city",
        "state",
        "postal_code",
        "telephone"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      )
      RETURNING "address_id";
      `,
      [
        formData.user_id,        // $1
        formData.address,        // $2
        formData.apartment,      // $3
        formData.city,           // $4
        formData.state,          // $5
        formData.postal_code,    // $6
        formData.telephone,      // $7
      ]
    );
    const address_id = result.rows[0].address_id;
    console.log('Address ID:', address_id);

    const orderResult = await pool.query(
      `
      INSERT INTO "orders" (
        "user_id",
        "shipping_cost",
        "address_id"
      ) VALUES (
        $1, 95, $2
      )
      RETURNING "order_id";
      `,
      [
        formData.user_id,          // $1 // $2
        address_id      // $3
      ]
    );
    const order_id = orderResult.rows[0].order_id;
    console.log('Order ID:', order_id);

    console.log('Cart Data:', formData.cartData);
    for (const item of formData.cartData) {
    const orderItemResult = await pool.query(
      `
      INSERT INTO "orderitems" (
        "order_id",
        "product_id",
        "quantity",
        "price_at_purchase",
        "size"
      ) VALUES (
        $1, $2, $3, $4, $5
      )
      RETURNING "order_item_id";
      `,
      [
        order_id,          // $1
        item.product_id,        // $2
        item.quantity,          // $3
        item.price, // $4
        item.size               // $8
      ]
    );

    const setStock = await pool.query(
      `
        UPDATE product_stock
        SET quantity = product_stock.quantity - $3
        WHERE 
          product_id = $1
          AND size = $2
        RETURNING quantity;
        `,
        [
          item.product_id, // $1
          item.size,        // $2
          item.quantity
        ]
          );
        
      console.log('Updated stock quantity:');
    };

    const paymentResults = await pool.query(
      `
      INSERT INTO "payments" (
        "order_id",
        "user_id",
        "payment_method",
        "amount_paid",
        "payment_date"
      ) VALUES (
        $1, $2, $3, $4, NOW()
      )
      RETURNING "payment_id";
      `,
      [
        order_id,        // $2
        formData.user_id,         // $3
        formData.payment_method,  // $4
        formData.price,     // $5
      ]
    );
    const payment_id = paymentResults.rows[0].payment_id;
    console.log('Payment ID:', payment_id);
    

    await pool.query('COMMIT');
    console.log('Transaction committed successfully!');
    res.json({ message: 'Order placed successfully!' });
  }
  catch (err) {
    console.error(err.message);
    await pool.query('ROLLBACK');
    res.status(500).send('Server Error');
  }

  }

module.exports = {getCartData, addToCart, removeFromCart, placeOrder};