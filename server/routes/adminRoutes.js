const express = require('express');
const { isAdminMiddleware } = require('../middleware/isAdmin');
const { adminWorks } = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();


router.get('/', authMiddleware, isAdminMiddleware, adminWorks);

module.exports = router;