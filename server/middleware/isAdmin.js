// middleware/isAdmin.js

const isAdminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role != 'admin') {
      console.log('Userrole:', req.user.role);
      console.log('User is not an admin');  
      return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });

    }
    console.log('User admin');  

    next();
  };
  
  module.exports = {isAdminMiddleware};
  