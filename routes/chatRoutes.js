// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post("/with/:withId", chatController.chatWithId)
router.get('/from/:withId', chatController.getChatByUserId);

module.exports = router;
