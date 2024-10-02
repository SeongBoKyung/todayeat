const { searchStore } = require('../services/kakaoMapService');

// 한국의 위도와 경도 범위
const KOREA_LATITUDE_RANGE = [33.0, 38.6];
const KOREA_LONGITUDE_RANGE = [124.0, 131.0];

const getStoreSearch = async (req, res) => {
    const { longitude, latitude, radius, menu } = req.query;

    // case 1. 필수 파라미터 누락
    let missingParams = [];

    if (!longitude) {
        missingParams.push("경도(longitude)");
    }
    if (!latitude) {
        missingParams.push("위도(latitude)");
    }
    if (!radius) {
        missingParams.push("반경(radius)");
    }
    if (!menu) {
        missingParams.push("메뉴(menu)");
    }

    if (missingParams.length > 0) {
        return res.status(400).json({ 
            success: false, 
            message: `${missingParams.join(', ')}가 필요합니다.` 
        });
    }

    // case 2. 한국 밖에 위치
    if (
        latitude < KOREA_LATITUDE_RANGE[0] || latitude > KOREA_LATITUDE_RANGE[1] ||
        longitude < KOREA_LONGITUDE_RANGE[0] || longitude > KOREA_LONGITUDE_RANGE[1]
    ) {
        return res.status(400).json({
            success: false,
            message: "서비스 지원 지역이 아닙니다."
        });
    }

    // 매장 리스트 받기
    try {
        const places = await searchStore(longitude, latitude, radius, menu);
        res.json({ success: true, places });
    } catch (error) {
        if (error.message === '반경이 너무 큽니다. 최대 반경은 20km입니다.') {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error.message === '조건에 맞는 매장이 없습니다.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: '매장 정보를 가져오는 중 오류가 발생했습니다.', error: error.message });
    }
};

module.exports = {
    getStoreSearch
};