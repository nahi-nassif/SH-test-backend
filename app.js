// app.js
const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());

//Connect to the databse
const connectDB = require('./config/db');
connectDB()

const authenticationRoutes = require('./routes/authRoutes');
app.use('/api/auth', authenticationRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

app.all("/*",(req, res) => {
    res.status(404).json({ message: "You will need to specify a correct route"})
})

module.exports = app;