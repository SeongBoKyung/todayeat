const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');

// 카카오 로그인 요청을 처리 (카카오 로그인 페이지로 리다이렉트)
router.get('/login', authController.kakaoLogin);

// 카카오 로그인 인증 완료 후 콜백 처리
router.get('/login/callback', authController.kakaoCallback);

// 로그인 상태 확인
router.get('/status', authenticateJWT, authController.loginStatus);

// 로그아웃
router.post('/logout', authController.logout);

// 회원탈퇴
router.delete('/delete', authenticateJWT, authController.deleteUser);

module.exports = router;