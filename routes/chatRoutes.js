// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.patch('/add', chatController.saveChat);
router.get('/from/:withId', chatController.getChatByUserId);

module.exports = router;
