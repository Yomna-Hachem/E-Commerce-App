const pool = require('../db');
const multer = require('multer');
const path = require('path');

const adminWorks = (req, res) => {
    console.log('Admin works!');
    res.json({ message: 'Reached adminWorks route' });
};

// Set up multer storage options
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../client/public/images'), // Store images in this folder
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  },
});

const upload = multer({ storage }).single('image'); // Middleware for handling single image upload

const setInventoryLevels = async (req, res) => {
    console.log('Admin baby!');
    const { stockUpdates } = req.body; // Assuming stockUpdates is an array of objects with product_id and quantity
    console.log(stockUpdates);
        try {
          const result = await pool.query(`
            INSERT INTO "product_stock" ("product_id", "size", "quantity")
            VALUES 
              ($1, 'Small', $2),
              ($1, 'Medium', $3),
              ($1, 'Large', $4),
              ($1, 'XLarge', $5)
            ON CONFLICT ("product_id", "size")
            DO UPDATE SET 
              "quantity" = EXCLUDED."quantity"
            RETURNING "product_id", "size", "quantity";
          `, [
            stockUpdates[0].product_id,
            stockUpdates[0].quantity || 0,
            stockUpdates[1].quantity || 0,
            stockUpdates[2].quantity || 0,
            stockUpdates[3].quantity || 0
          ]);
      
            res.json({ message: 'Stock updated successfully!' });

        } catch (error) {
          console.error('Database Error:', error.message);
          throw new Error(`Failed to update stock: ${error.message}`);
        }
      };

const addNewProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).json({ error: 'Error uploading image' });
    }

    const {
      name,
      description,
      color,
      price,
      category_id,
    } = req.body;

    // Validate required fields
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name or price' });
    }

    // Get the image URL
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;

    try {
      // Insert product into the database
      const result = await pool.query(
        `INSERT INTO Products (
          name, description, color, price,
          image_url, category_id
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          name,
          description || null,
          color || null,
          price,
          imageUrl, // Use the uploaded image URL
          category_id || null,
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        product: result.rows[0],
      });
    } catch (err) {
      console.error('Error adding product:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

const updateProduct = async (req, res) => {
  const { product_id, name, description, color, price, category_id } = req.body;

  try {
    
    const result = await pool.query(
      `UPDATE Products
       SET name = $1, description = $2, color = $3, price = $4, category_id = $5
       WHERE product_id = $6
       RETURNING *`,
      [name, description, color, price, category_id, product_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: result.rows[0],
    });
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const deleteProduct = async (req, res) => {
  const { product_id } = req.body;
  console.log('Deleting product with ID:', product_id);

  try {
    
    const result = await pool.query(
      `DELETE FROM Products
       WHERE product_id = $1
       RETURNING *`,
      [product_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      product: result.rows[0],
    });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { adminWorks, setInventoryLevels, addNewProduct, updateProduct, deleteProduct };