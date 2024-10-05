const express = require('express');
const router = express.Router();
const { getFilteredMenu } = require('../controllers/menuController');
const { likeMenu, dislikeMenu } = require('../controllers/likeController');
const authenticateJWT = require('../middleware/authMiddleware');

// 메뉴 추천
router.get('/recommend', getFilteredMenu);

// 좋아요
router.post('/like', authenticateJWT, likeMenu);

// 싫어요
router.post('/dislike', authenticateJWT, dislikeMenu);

module.exports = router;