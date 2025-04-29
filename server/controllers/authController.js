const pool = require('../db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/auth');

const loginUser = async (req, res) => {
  const {username, password} = req.body;



  try {
    // 1. Check if user exists
    const result = await pool.query('SELECT user_id, first_name, last_name, email, profile_picture, password_hash FROM users WHERE email = $1 LIMIT 1', [username]);
    console.log(result.rowCount);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    console.log(result.rows[0]);

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });

    }
    // 3. Generate JWT token
    const token = generateToken({ userId: user.user_id }); 

    // 4. Remove sensitive data before sending response
    delete user.password_hash;

    // 5. Set cookie (optional)
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // 6. Send response with token and user data
    res.json({ 
      success: true,
      token,
      user,
      message: 'Login successful' 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
};

const signUpUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  console.log(req.body)
  console.log(email)

  // Validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: email, password, first_name, last_name'
    });
  }

  try {
    // 1. Check for existing user
    const userExists = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert new user (UUID will auto-generate)

    const DEFAULT_PROFILE_PICTURE = '/images/defaultPP.jpg';
    const newUser = await pool.query(
      `INSERT INTO users (
        first_name, 
        last_name, 
        email, 
        password_hash, 
        profile_picture,
        role
      ) VALUES ($1, $2, $3, $4, $5, DEFAULT)
      RETURNING 
        user_id, 
        first_name, 
        last_name, 
        email, 
        profile_picture, 
        role, 
        created_at`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        
        DEFAULT_PROFILE_PICTURE // Handle optional field
      ]
    );

    // 4. Generate JWT (including role for frontend permissions)
    const token = generateToken({
      userId: newUser.rows[0].user_id,
      role: newUser.rows[0].role
    });

    // 5. Set secure cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    // 6. Respond with user data (excluding password_hash)
    res.status(201).json({
      success: true,
      token,
      user: newUser.rows[0],
      message: 'Registration successful'
    });

  } catch (err) {
    console.error('Signup error:', err.message);
    
    if (err.message.includes('violates check constraint')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax' // Or 'None' if cross-site in production + HTTPS
  });

  res.json({ success: true, message: 'Logged out successfully' });
};



module.exports = { loginUser, signUpUser, logoutUser };

