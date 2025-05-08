// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const pool = require('../db'); // Assuming you have a database connection

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../client/public/images'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = `/images/${req.file.filename}`;
    console.log("here",imagePath)
    const userId = req.user.userId; // From auth middleware

    // Update the user's profile picture in the database
    const result = await pool.query(
      'UPDATE users SET profile_picture = $1 WHERE user_id = $2 RETURNING *',
      [imagePath, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ 
      success: true,
      imagePath: imagePath,
      user: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;