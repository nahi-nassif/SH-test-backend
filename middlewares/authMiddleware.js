// middlewares/authMiddleware.js
const jwt = require('../utils/jwt');
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        req.user = jwt.verifyToken(token);
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid Session: Unauthorized' });
    }
};
module.exports = authMiddleware;
