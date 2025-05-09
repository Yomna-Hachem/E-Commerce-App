const express = require('express');
const { isAdminMiddleware } = require('../middleware/isAdmin');
const { adminWorks } = require('../controllers/adminController');
const { setInventoryLevels } = require('../controllers/adminController');
const {addNewProduct} = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();


router.get('/', authMiddleware, isAdminMiddleware, adminWorks);
router.post('/manageProducts', authMiddleware, isAdminMiddleware, setInventoryLevels);
router.post('/addNewProduct', authMiddleware, isAdminMiddleware, addNewProduct);

module.exports = router;