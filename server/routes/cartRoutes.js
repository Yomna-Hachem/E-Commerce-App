const express = require('express');
const router = express.Router();
const { getCartData} = require('../controllers/cartController'); // Assuming you have a getCartData function in your controller
const { addToCart } = require('../controllers/cartController'); // Assuming you have a getCartData function in your controller
const { removeFromCart } = require('../controllers/cartController'); // Assuming you have a getCartData function in your controller
const { placeOrder } = require('../controllers/cartController'); // Assuming you have a getCartData function in your controller
const { checkCouponValidity } = require('../controllers/cartController'); // Assuming you have a getCartData function in your controller
const {authMiddleware }= require('../middleware/auth');

router.get('/:user_id', getCartData);
router.post('/add', addToCart); // Assuming you have a getCartData function in your controller
router.delete('/remove', removeFromCart); // Assuming you have a getCartData function in your controller
router.post('/checkout', placeOrder);
router.get('/coupons/:code', authMiddleware, checkCouponValidity); // Assuming you have a getCartData function in your controller

module.exports = router;
