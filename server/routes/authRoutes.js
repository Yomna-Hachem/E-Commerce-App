const express = require('express');
const router = express.Router();
const { loginUser, signUpUser, logoutUser, updateUserInfo, updateUserPassword } = require('../controllers/authController');
const {authMiddleware }= require('../middleware/auth');

router.post('/login', loginUser);
router.post('/signup', signUpUser)
router.post('/logout', logoutUser);
router.post('/updateUserInfo',authMiddleware ,updateUserInfo);
router.post('/updateUserPassword',authMiddleware, updateUserPassword);
module.exports = router;
