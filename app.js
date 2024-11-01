// app.js
const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());
const cors = require('cors'); // Import the 'cors' package
app.use(cors());

//Connect to the databse
const connectDB = require('./config/db');
connectDB()

//Session Tokens middleWare
const authMiddleware = require('./middlewares/authMiddleware');
//Authentication Routes
const authenticationRoutes = require('./routes/authRoutes');
app.use('/api/auth', authenticationRoutes);
//Chat Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', authMiddleware, chatRoutes);
//Spotify Routes
const spotifyRoutes = require('./routes/spotifyRoutes');
app.use('/api/spotify', authMiddleware, spotifyRoutes);

app.all("/*",(req, res) => {
    res.status(404).json({ message: "You will need to specify a correct route"})
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

// Graceful shutdown
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;