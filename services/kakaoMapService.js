const axios = require('axios');
require('dotenv').config();

const KAKAO_MAP_API_KEY = process.env.KAKAO_REST_API_KEY;

const kakaoApiClient = axios.create({
    baseURL: 'https://dapi.kakao.com',
    headers: {
        Authorization: `KakaoAK ${KAKAO_MAP_API_KEY}`
    }
});

const searchStore = async (longitude, latitude, radius, menu) => {
    try {
        // case 1. 반경이 너무 큰 경우
        if (radius > 20000) { 
            throw new Error('반경이 너무 큽니다. 최대 반경은 20km입니다.');
        }
        const response = await kakaoApiClient.get('/v2/local/search/keyword.json', {
            params: {
                query: menu,
                x: longitude,
                y: latitude,    
                radius: radius 
            }
        });

        // case 2. 조건에 맞는 매장이 없는 경우
        if (response.data.documents.length === 0) {
            throw new Error('조건에 맞는 매장이 없습니다.');
        }

        const stores = response.data.documents.map(store => ({
            store_name: store.place_name,
            address: store.road_address_name || store.address_name,
            phone_number: store.phone || '전화번호 없음',
            distance: parseInt(store.distance)
        }));

        // 거리 기준 오름차순으로 정렬된 리스트 반환
        return stores.sort((a, b) => a.distance - b.distance);
    } catch (error) {
        console.error('Kakao API에서 에러 발생:', error);
        throw error;
    }
};
  
module.exports = {
    searchStore
};
