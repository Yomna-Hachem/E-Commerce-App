const express = require('express');
const router = express.Router();
const { loginUser, signUpUser, logoutUser } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/signup', signUpUser)
router.post('/logout', logoutUser);

module.exports = router;
