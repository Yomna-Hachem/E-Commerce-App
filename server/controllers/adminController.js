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



module.exports = {adminWorks, setInventoryLevels};