const mongoose = require("mongoose");
const connectDB = require('../config/db');
const Food = require('../models/Food');
const seed = require('./seed');
const testSeed = require('./testSeed');

connectDB();

const seedDB = async () => {
    try {
        await Food.deleteMany({});            
        const uploadedData = await Food.insertMany(seed);
        
        console.log(`Total items uploaded: ${uploadedData.length}`);
        console.log('Complete to upload all of the seed');
    } catch (err) {
        console.error('데이터 업로드 실패:', err.message);
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})