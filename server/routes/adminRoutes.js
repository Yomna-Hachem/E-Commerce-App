const express = require('express');
const { isAdminMiddleware } = require('../middleware/isAdmin');
const { adminWorks } = require('../controllers/adminController');
const { setInventoryLevels } = require('../controllers/adminController');
const {addNewProduct} = require('../controllers/adminController');
const { updateProduct } = require('../controllers/adminController');
const { deleteProduct } = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/auth');
const { applyDiscount } = require('../controllers/adminController');
const { addCampaign } = require('../controllers/adminController');
const router = express.Router();


router.get('/', authMiddleware, isAdminMiddleware, adminWorks);
router.post('/manageProducts', authMiddleware, isAdminMiddleware, setInventoryLevels);
router.post('/addNewProduct', authMiddleware, isAdminMiddleware, addNewProduct);
router.put('/updateProduct', authMiddleware, isAdminMiddleware, updateProduct);
router.delete('/deleteProduct', authMiddleware, isAdminMiddleware, deleteProduct);
router.post('/applyDiscount', authMiddleware, isAdminMiddleware, applyDiscount);
router.post('/addCampaign', authMiddleware, isAdminMiddleware, addCampaign);
module.exports = router;