// controllers/userController.js
const User = require("../models/User")
const jwt = require('../utils/jwt');

exports.register = async (req, res) => {
    try {
        // Attempt to create the a user in the database
        const user = await User.create({});
        res.status(201).json({ token: jwt.generateToken(user) });

    } catch (error) {
        console.error('Error creating user:', error);
        // Send an appropriate error response
        res.status(500).json({
            message: 'An error occurred while creating the user.',
            error: error.message,  // Optionally include error details
        });
    }
}