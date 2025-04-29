const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../controllers/productController');
const { displayProductDetails } = require('../controllers/productController');
const { getStockInfo} = require('../controllers/productController');
const { getReviewsInfo } = require('../controllers/productController'); // Assuming you have a getReviewsInfo function in your controller

router.get('/', getAllProducts);
router.get('/productDetails/:id', displayProductDetails);
router.get('/stockInfo/:id', getStockInfo);
router.get('/reviewsInfo/:id', getReviewsInfo); // Assuming you have a getReviewsInfo function in your controller

module.exports = router;