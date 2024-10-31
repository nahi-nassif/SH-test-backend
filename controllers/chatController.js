// controllers/chatController.js
const Chat = require('../models/Chat');

exports.saveChat = async (req, res) => {

    try {
        // Attempt to create the a chat in the database
        const { message, fromId } = req.body;
        const userId = req.user?.id;

        if(!message || !fromId || !userId){
            // Send an appropriate error response
            res.status(500).json({
                message: 'Invalid or Missing Fields for creating a chat.',
                error: 'Invalid or Missing Fields for creating a chat.'
            });
            return;
        }

        const chat = new Chat({ 
            userId: userId, 
            message: message,
            fromId: fromId
        });

        await chat.save();
        res.status(201).json({ message: 'Chat saved' });

    } catch (error) {
        console.error('Error creating chat:', error);
        // Send an appropriate error response
        res.status(500).json({
            message: 'An error occurred while creating the chat.',
            error: error.message,  //include error details
        });
    }
};

exports.getChatByUserId = async (req, res) => {

    try {
        // Attempt to create the a chat in the database
        const userId = req.user?.id;
        const withId = req.params.withId;

        if(!withId || !userId){
            // Send an appropriate error response
            res.status(500).json({
                message: 'Invalid request for getting the chats.',
                error: 'Invalid request for getting the chats.'
            });
            return;
        }

        const chats = await Chat.find().byUserId(userId, withId).exec();

        res.status(201).json(chats);

    } catch (error) {
        console.error('Error getting the chats:', error);
        // Send an appropriate error response
        res.status(500).json({
            message: 'An error occurred while getting the chats.',
            error: error.message,  //include error details
        });
    }
};
