// controllers/userController.js
const User = require("../models/User")

exports.register = async (req, res) => {
    try {
        // Attempt to create the a user in the database
        const user = await User.create({});
        console.log("user: ", user)
        res.status(201).json({ message: "user created"});

    } catch (error) {
        console.error('Error creating user:', error);
        // Send an appropriate error response
        res.status(500).json({
            message: 'An error occurred while creating the user.',
            error: error.message,  // Optionally include error details
        });
    }
}