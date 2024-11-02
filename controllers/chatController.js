// controllers/chatController.js
const Chat = require('../models/Chat');
const spotify = require("../services/spotify");
const gemini = require("../services/gemini");
const marked = require('marked');

const saveChat = async (userId, fromId, message, isReply = false) => {

    try {

        if(!message || !fromId || !userId){
            // Send an appropriate error response
            throw new Error("Invalid or Missing Fields for creating a chat.")
        }
        // Attempt to create the a chat in the database
        const chat = new Chat({ 
            userId: userId, 
            message: message,
            fromId: fromId,
            isReply: isReply
        });
        
        await chat.save();
        return { message: 'Chat saved' };

    } catch (error) {
        console.error('Error creating chat:', error);
        // Send an appropriate error response
        throw new Error("An error occurred while creating the chat.")
    }
};

exports.getChatByUserId = async (req, res) => {

    try {
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

exports.chatWithId = async (req, res) => {

    try {
        const userId = req.user?.id;
        const withId = req.params.withId;
        const message = req.body.message;

        if(!withId || !message || !userId){
            res.status(500).json({
                message: 'Invalid request for sending messages.',
                error: 'Invalid request for sending messages.'
            });
            return;
        }

        //Log the user message
        saveChat(userId, withId, message , false);

        //Check if the AI is setup correctly
        if(!gemini.isGeminiSetupCorrectly(withId)){
            const artistName = await spotify.getArtistNameById(withId);
            gemini.setupNewGemini({ id: withId, name: artistName});
        }

        const apiResponse = await gemini.getGeminiResponse(message);

        const html = marked.parse(apiResponse.message.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,""));

        //Log the AI response
        saveChat(userId, withId, html, true);

        

        res.status(201).json({ message: html.replace(/[\n]/g,'<br/>')})

    } catch (error){
        console.error('Error getting a response from gemini:', error);
        // Send an appropriate error response
        res.status(500).json({
            message: 'An error occurred while getting a response from gemini.',
            error: error.message,  //include error details
        });
    }

}