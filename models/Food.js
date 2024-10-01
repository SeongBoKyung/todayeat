const mongoose =require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const foodSchema =new mongoose.Schema({
    food_id: { type: Number, required: true, unique: true },
    name: { type: String, required:true, unique: true },
    category: { type: [String], required: true },
    calorie: { type: Number, required: true },
    price: { type: String, required: true},
    image: { type: String, default: '' },
    likes: { type: Number, default: 0 }
});

foodSchema.plugin(AutoIncrement, { inc_field: 'food_id' });

module.exports = mongoose.model('Food', foodSchema);