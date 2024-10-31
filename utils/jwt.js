// utils/jwt.js
const jwt = require('jsonwebtoken');
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
module.exports = { generateToken, verifyToken };
