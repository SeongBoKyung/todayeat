const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

//load env
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

//connect mongoDB
connectDB();

//middleware
app.use(cors());
app.use(express.json());

//connect route
app.use('/auth', require('./routes/authRoutes'));
app.use('/menu', require('./routes/menuRoutes'));
app.use('/store', require('./routes/storeRoutes'));

//start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});