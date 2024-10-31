// models/Chat.js
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User reference
    message: { type: String, required: true }, //message sent
    fromId: { type: String, required: true },  // 'userId' or 'senderId'
    timestamp: { type: Date, default: Date.now },
    isReply: { type: Boolean, default: false }
},
{
    query: {
        byUserId(id, withId) {
          return this.where({ userId: id , fromId: withId});
        }
    }
});

module.exports = mongoose.model('Chat', ChatSchema);
