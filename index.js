const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');

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
app.use('/menu', menuRoutes);
app.use('/auth', authRoutes);
app.use('/store', storeRoutes);

//start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});