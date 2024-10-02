const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');

dotenv.config(); 

const app = express();

// mongoDB 연결
connectDB();

const corsOptions = {
    origin: 'https://www.google.com' || 'http://localhost:3000', // 허용할 도메인 설정
    optionsSuccessStatus: 200 
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());

// route 연결
app.use('/menu', menuRoutes);
app.use('/auth', authRoutes);
app.use('/store', storeRoutes);

// 서버 실행
app.listen(3000, () => {
    console.log(`Server running on port ${PORT}`);
});