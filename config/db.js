const mongoose = require('mongoose');
const dotenv = require('dotenv');

//load env
dotenv.config();

const connectDB = async () => {mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected~~ :)'))
    .catch(err => console.error('MongoDB connection error:', err))
};

module.exports = connectDB;