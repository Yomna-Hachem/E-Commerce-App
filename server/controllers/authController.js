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

const updateUserInfo = async (req, res) => {
  console.log('req.user');
  console.log(req.user);
  const { userId } = req.user;
  const { first_name, last_name, email } = req.body;
  console.log(req.body);
  console.log(req.user);
  if (!first_name && !last_name && !email) {
    return res.status(400).json({
      success: false,
      message: 'No fields provided to update'
    });
  }

  try {
    const fieldsToUpdate = [];
    const values = [];
    let index = 1;

    if (first_name) {
      fieldsToUpdate.push(`first_name = $${index++}`);
      values.push(first_name);
    }
    if (last_name) {
      fieldsToUpdate.push(`last_name = $${index++}`);
      values.push(last_name);
    }
    if (email) {
      fieldsToUpdate.push(`email = $${index++}`);
      values.push(email);
    }

    values.push(userId); // for WHERE clause

    const query = `
      UPDATE users
      SET ${fieldsToUpdate.join(', ')}
      WHERE user_id = $${index}
      RETURNING user_id, first_name, last_name, email, profile_picture, role, created_at
    `;

    const updatedUser = await pool.query(query, values);

    res.status(200).json({
      success: true,
      user: updatedUser.rows[0],
      message: 'User information updated successfully'
    });
  } catch (err) {
    console.error('Update user info error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update user information'
    });
  }
};



const updateUserPassword = async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;
  console.log(currentPassword)
  console.log(newPassword)

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current and new passwords are required'
    });
  }

  try {
    // 1. Fetch user’s hashed password
    const result = await pool.query(
      'SELECT password_hash FROM users WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const storedHash = result.rows[0].password_hash;

    // 2. Compare current password
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password'
      });
    }

    // 3. Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Update password in DB
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE user_id = $2',
      [newHashedPassword, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    console.error('Update password error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update password'
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



module.exports = { loginUser, signUpUser, updateUserInfo, updateUserPassword, logoutUser };

