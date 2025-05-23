// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'E-CommerceDB',
//   password: 'database',
//   port: 5432,
// });

// module.exports = pool;

const { Pool } = require('pg');

// Load environment variables (if using dotenv)
require('dotenv').config();

// Create a new Pool instance with the Supabase PostgreSQL connection string
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Use your pooling URL
  ssl: {
    rejectUnauthorized: false, // Recommended for production
  },
});

// Export the pool so it can be used in other parts of your application
module.exports = pool;
