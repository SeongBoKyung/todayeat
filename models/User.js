const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    account_created_at: { type: Date, required: true }
});

module.exports = mongoose.model('User', userSchema);