// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now }, //user creation date
});
module.exports = mongoose.model('User', UserSchema);
