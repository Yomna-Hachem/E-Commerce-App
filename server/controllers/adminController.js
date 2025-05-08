const pool = require('../db');

const adminWorks = (req, res) => {
    console.log('Admin works!');
    res.json({ message: 'Reached adminWorks route' });
};

module.exports = {adminWorks};