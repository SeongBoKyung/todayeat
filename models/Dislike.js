const mongoose = require('mongoose');

const dislikeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.String, required: true, ref: 'User' },
    food_id: { type: mongoose.Schema.Types.Number, required: true, ref: 'Food' },
    dislike_date: { type: Date, default: Date.now, required: true },
});

const Dislike = mongoose.model('Dislike', dislikeSchema);

module.exports = Dislike;