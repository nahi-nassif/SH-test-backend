// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');

//Usually this request contains user data
router.patch('/register', userController.register);
module.exports = router;
