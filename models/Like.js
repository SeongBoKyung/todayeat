const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.String, required: true, ref: 'User' },
    food_id: { type: mongoose.Schema.Types.Number, required: true, ref: 'Food' },
    like_date: { type: Date, default: Date.now, required: true },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like ;