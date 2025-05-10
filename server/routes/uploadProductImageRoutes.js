const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const pool = require('../db');

// Set up multer storage options
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../client/public/images'), // Store images in this folder
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  },
});

const upload = multer({ storage });

// Route for uploading product image
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imageUrl = `/images/${req.file.filename}`; // Store relative path to the image

    res.status(200).json({ success: true, imageUrl });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
