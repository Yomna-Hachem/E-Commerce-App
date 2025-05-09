const pool = require('../db');

const adminWorks = (req, res) => {
    console.log('Admin works!');
    res.json({ message: 'Reached adminWorks route' });
};

const setInventoryLevels= async (req, res) => {
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
            stockUpdates[1].quantity|| 0,
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
        const {
          name,
          description,
          color,
          size,
          price,
          image_url,
          stock_quantity,
          category_id,
          product_tax_category_id
        } = req.body;
      
        // Validate required fields
        if (!name || price === undefined || stock_quantity === undefined) {
          return res.status(400).json({ error: 'Missing required fields: name, price, or stock_quantity' });
        }
      
        try {
          const result = await pool.query(
            `INSERT INTO Products (
              name, description, color, price,
              image_url,  category_id,
              product_tax_category_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
              name,
              description || null,
              color || null,
              price,
              image_url || null,
              stock_quantity,
              category_id || null,
              product_tax_category_id || null
            ]
          );
      
          res.status(201).json({ message: 'Product added successfully', product: result.rows[0] });
        } catch (err) {
          console.error('Error adding product:', err.message);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
      

module.exports = {adminWorks, setInventoryLevels, addNewProduct};