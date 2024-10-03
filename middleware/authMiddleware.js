const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    //토큰이 있을 경우
    if(authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            //토큰이 유효하지 않을 때
            if(err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        message: '토큰이 만료되었습니다. 로그아웃 처리 후 다시 로그인해주세요.',
                        redirectUrl: '/auth/login'
                    });
                }
                return res.status(403).json({
                    success: false,
                    message: '유효하지 않은 토큰입니다. 로그아웃 처리 후 다시 로그인해주세요.',
                    redirectUrl: '/auth/login'
                });
            }
            
            //토큰이 유효할 때
            req.user = user // 사용자 정보를 req에 추가
            next();   //loginStatus 실행
        });
    } else {
        return res.status(401).json({
            success: false,
            message: '토큰이 존재하지 않습니다. 로그인 페이지로 이동합니다.',
            redirectUrl: '/auth/login'
        });
    }
}

module.exports = authenticateJWT;