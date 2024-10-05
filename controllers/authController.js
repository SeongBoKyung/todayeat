const kakaoAuthService = require('../services/kakaoAuthService');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Like = require('../models/Like');
const Dislike = require('../models/Dislike');

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
            { expiresIn: '1h' } //테스트 용이
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

// 로그인 상태 확인
const loginStatus = (req, res) => {
    res.json({
        success: true,
        message: "로그인 상태입니다.",
        user: req.user //미들웨어에서 추가
    })
}

// 로그아웃(프론트에서 jwt 토큰 무효화)
const logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: "로그아웃 되었습니다. (클라이언트 측에서 jwt 토큰 삭제)"
    });
};

// 회원 탈퇴
const deleteUser = async (req, res) => {
    try {
        const user_id = req.user.user_id; 

        const user = await User.findOneAndDelete({ user_id });
        if (!user) {
            return res.status(404).json({ success: false, message: '회원 정보를 찾을 수 없습니다.' });
        }

        await Like.deleteMany({ user_id });
        await Dislike.deleteMany({ user_id });

        res.status(200).json({
            success: true,
            message: '회원탈퇴가 완료되었습니다. 관련 데이터가 모두 삭제되었습니다.',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '회원탈퇴 중 오류가 발생했습니다.', error: error.message });
    }
};

module.exports = {
    kakaoLogin,
    kakaoCallback,
    loginStatus,
    logout,
    deleteUser
};