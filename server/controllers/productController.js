const pool = require('../db');

const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
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
  const { id } = req.params;  // <-- GET ID from URL params
  try {
    const result = await pool.query('select size, quantity from product_stock where product_id = $1', [id]);
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

module.exports = { getAllProducts, displayProductDetails, getStockInfo, getReviewsInfo };