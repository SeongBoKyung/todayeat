const kakaoAuthService = require('../services/kakaoAuthService');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// 카카오 로그인 URL 반환
const kakaoLogin = (req, res) => {
    const kakaoAuthUrl = kakaoAuthService.getKakaoAuthUrl();
    res.redirect(kakaoAuthUrl);
};

// 카카오 로그인 콜백 처리
const kakaoCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ success: false, message: "Authorization code is missing." });
        }

        const token = await kakaoAuthService.getKakaoToken(code);  //코드 -> 액세스 토큰

        const userInfo = await kakaoAuthService.getUserInfo(token); //액세스 토큰 -> 사용자 정보

        let user = await User.findOne({ user_id: userInfo.user_id }); //사용자 정보 -> db 조회
        
        let message = '';

        // 사용자 정보가 없으면 새로 생성
        if (!user) {
            message = '가입이 완료되었습니다.';
            
            user = new User({
                user_id: userInfo.user_id,
                account_created_at: userInfo.account_created_at
            });
            await user.save();
        }

        const jwtToken = jwt.sign(
            { user_id: user.user_id },
            JWT_SECRET,
            { expiresIn: '1m' } //테스트 용이
        )

        
        res.status(200).json({ 
            success: true, 
            message: message == '' ? '이미 가입된 회원입니다.' : message, 
            token: jwtToken,
            data: user 
        });
    } catch (error) {
        console.error('카카오 로그인 실패:', error.message);
        res.status(500).json({ success: false, message: '카카오 로그인 중 오류 발생', error: error.message });
    }
};

const loginStatus = (req, res) => {
    res.json({
        success: true,
        message: "로그인 상태입니다.",
        user: req.user //미들웨어에서 추가
    })
}

const logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: "로그아웃 되었습니다. (클라이언트 측에서 jwt 토큰 삭제)"
    });
};

module.exports = {
    kakaoLogin,
    kakaoCallback,
    loginStatus,
    logout
};