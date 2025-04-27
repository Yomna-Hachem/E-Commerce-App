const pool = require('../db');

const loginUser = async (req, res) => {
  const {username, password} = req.body;

  console.log(username);
  console.log(password);
  //email = "john.doe@example.com"; // Replace this line with dynamic email input if needed.

  try {
    // 1. Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [username]);
    console.log(result.rowCount);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    console.log(result.rows[0]);

    // 2. Compare passwords (no encryption in this case)
    console.log(password == user.password_hash);
    if (password != user.password_hash) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // No JWT or token generation now

    res.json({ message: 'Login successful' }); // Responding with a simple success message
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' }); // Always send JSON on errors
  }
};

module.exports = { loginUser };
