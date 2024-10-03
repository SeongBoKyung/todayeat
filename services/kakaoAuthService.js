const { Account } = require('aws-sdk');
const axios = require('axios');
require('dotenv').config();

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

const getKakaoAuthUrl = () => {
    const baseUrl = 'https://kauth.kakao.com/oauth/authorize';
    const redirectUri = encodeURIComponent(KAKAO_REDIRECT_URI);
    const url = `${baseUrl}?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${redirectUri}`;
    return url;
};

const getKakaoToken = async (code) => {
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';
    const body = {
        grant_type: 'authorization_code',
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code
    };

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const tokenResponse = await axios.post(tokenUrl, new URLSearchParams(body).toString(), { headers });
    return tokenResponse.data.access_token;
};

const getUserInfo = async (token) => {
    const userUrl = 'https://kapi.kakao.com/v2/user/me';
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const userResponse = await axios.get(userUrl, { headers });
    const { id, connected_at } = userResponse.data;
    return { user_id: id, account_created_at: connected_at };
}

module.exports = {
    getKakaoAuthUrl,
    getKakaoToken,
    getUserInfo
};