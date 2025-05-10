const express = require('express');
const router = express.Router();
const {authMiddleware }= require('../middleware/auth');
const { isAdminMiddleware } = require('../middleware/isAdmin');

const { getUserOrders, updateOrderStatus, getAllRefundedOrders } = require('../controllers/ordersController');
const { getAllOrders } = require('../controllers/ordersController');
const { cancelOrder } = require('../controllers/ordersController');
const { requestRefund } = require('../controllers/ordersController');
const { updateRefundStatus } = require('../controllers/ordersController');


router.get('/Myorders', authMiddleware, getUserOrders); 
router.get('/allOrders', authMiddleware, isAdminMiddleware, getAllOrders); 
router.get('/allOrdersRefunds', authMiddleware, isAdminMiddleware, getAllRefundedOrders); 
router.put('/cancel/:orderId', cancelOrder);
router.post('/requestRefund/:orderId', authMiddleware, requestRefund);
router.post('/updateStatus', authMiddleware, isAdminMiddleware, updateOrderStatus); 
router.post('/updateStatusRefunds', authMiddleware, isAdminMiddleware, updateRefundStatus); 




module.exports = router;