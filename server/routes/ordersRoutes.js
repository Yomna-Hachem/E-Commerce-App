const express = require('express');
const router = express.Router();
const {authMiddleware }= require('../middleware/auth');

const { getUserOrders } = require('../controllers/ordersController');
const { getAllOrders } = require('../controllers/ordersController');

router.get('/Myorders', authMiddleware, getUserOrders); 
router.get('/allOrders', authMiddleware, getAllOrders); 