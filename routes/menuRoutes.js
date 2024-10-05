const express = require('express');
const router = express.Router();
const { getFilteredMenu } = require('../controllers/menuController');
const { likeMenu, dislikeMenu, getLikedFoods } = require('../controllers/likeController');
const authenticateJWT = require('../middleware/authMiddleware');

// 메뉴 추천
router.get('/recommend', getFilteredMenu);

// 좋아요
router.post('/like', authenticateJWT, likeMenu);

// 싫어요
router.post('/dislike', authenticateJWT, dislikeMenu);

// 좋아요 누른 음식 리스트 제공
router.get('/likes', authenticateJWT, getLikedFoods);

module.exports = router;