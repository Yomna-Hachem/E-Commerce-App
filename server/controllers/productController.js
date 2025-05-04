const pool = require('../db');

const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT p.*, c.name as category FROM products p JOIN categories c ON p.category_id = c.category_id');

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const displayProductDetails = async (req, res) => {
  const { id } = req.params;  // <-- GET ID from URL params
  console.log('Product ID:', id);
  try {
    const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getStockInfo = async (req, res) => {
  console.log('stock info called...✅');
  try {
    const result = await pool.query('select product_id, size, quantity from product_stock');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const getReviewsInfo = async (req, res) => {
  console.log('review info called...9');
  const { id } = req.params; 
  try {
    const result = await pool.query('select * from reviews where product_id = $1', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const submitReview = async (req, res) => {
  console.log('submit review called...9');
  const { product_id, user_id, rating, comment } = req.body; // Assuming you're sending these in the request body
  try {
    const result = await pool.query('INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)', [product_id, user_id, rating, comment]);
    res.json({ message: 'Review submitted successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

};

module.exports = { getAllProducts, displayProductDetails, getStockInfo, getReviewsInfo, submitReview };