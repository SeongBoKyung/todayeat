const { redisClient, ensureRedisConnected } = require('../config/redis');
const Food = require('../models/Food');
const Dislike = require('../models/Dislike');

const getFilteredMenu = async (req, res) => {
    try {
        await ensureRedisConnected();  // Redis 연결 확인

        const user_id = req.user ? req.user.user_id : 'guest';
        const { category, priceRange, distance } = req.query;

        const cacheKeyFilteredMenu = `menu:${category}:${priceRange}:${user_id}`;
        const cacheKeyExcludedItems = `excludedItems:${user_id}`;
        const cacheKeyDislikedItems = `dislikedItems:${user_id}`;

        const cacheKeyCategory = `lastCategory:${user_id}`;
        const cacheKeyPriceRange = `lastPriceRange:${user_id}`;
        const cacheKeyUserId = `lastUserId:${user_id}`;

        // 필수 파라미터 누락된 경우 처리
        let missingParams = [];
        if (!category) missingParams.push("카테고리(category)");
        if (!priceRange) missingParams.push("가격대(priceRange)");
        if (!distance) missingParams.push("거리(distance)");

        if (missingParams.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `${missingParams.join(', ')}가 필요합니다.` 
            });
        }

        // 캐싱된 추천 조건 받아오기
        const [cachedCategory, cachedPriceRange, cachedUserId] = await Promise.all([
            redisClient.get(cacheKeyCategory),
            redisClient.get(cacheKeyPriceRange),
            redisClient.get(cacheKeyUserId)
        ]);

        // 조건이 변경되었을 경우
        if (category !== cachedCategory || priceRange !== cachedPriceRange || user_id !== cachedUserId) {

            await redisClient.del(cacheKeyExcludedItems);
            
            // 새로운 파라미터를 Redis에 저장
            await redisClient.set(cacheKeyCategory, category);
            await redisClient.set(cacheKeyPriceRange, priceRange);
            await redisClient.set(cacheKeyUserId, user_id);

            let query = {};
            if (category !== 'all') query.category = { $in: category.split(',') };
            if (priceRange !== 'all') query.price = { $in: priceRange.split(',') };

            let filteredMenu = await Food.find(query);
            await redisClient.setEx(cacheKeyFilteredMenu, 3600, JSON.stringify(filteredMenu));
        }

        const cachedFilteredMenu = await redisClient.get(cacheKeyFilteredMenu);
        let filteredMenu = JSON.parse(cachedFilteredMenu);

        let dislikedItems = {};

        if (user_id !== 'guest') {
            const cachedDislikedItems = await redisClient.get(cacheKeyDislikedItems);

            if (cachedDislikedItems) {
                dislikedItems = JSON.parse(cachedDislikedItems);
            } else {
                dislikedItems = await Dislike.find({ user_id }).select('food_id').lean();
                dislikedItems = dislikedItems.map(dislike => dislike.food_id);

                redisClient.setEx(cacheKeyDislikedItems, 3600, JSON.stringify(dislikedItems));
            }
        }
        
        filteredMenu = filteredMenu.filter(menu => !dislikedItems.includes(menu.food_id));
        console.log('filteredMenu:', filteredMenu);

        // 해당 조건에 맞는 음식이 없을 때
        if (filteredMenu.length === 0) {
            return res.json({
                success: false,
                message: "해당 조건을 만족하는 음식이 없습니다."
            });
        }

        let message = "";

        // Redis에서 중복 추천 방지 리스트 가져옴
        const cachedExcludedItems = await redisClient.get(cacheKeyExcludedItems);
        let excludedItems = cachedExcludedItems ? JSON.parse(cachedExcludedItems) : [];

        let remainingMenu = filteredMenu.filter(menu => !excludedItems.includes(menu.food_id));

        // 남아있는 음식이 없을 때
        if (remainingMenu.length === 0) {
            excludedItems = [];  // 초기화
            await redisClient.del(cacheKeyExcludedItems);
            message = "설정하신 카테고리의 음식을 모두 확인하셨습니다. 설정하신 카테고리에 맞는 음식들을 재추천합니다.";

            remainingMenu = filteredMenu;
        }

        console.log('중복없는 리스트:', remainingMenu);

        const nextMenu = remainingMenu[Math.floor(Math.random() * (remainingMenu.length - 1))];
        excludedItems.push(nextMenu.food_id);
        await redisClient.setEx(cacheKeyExcludedItems, 3600, JSON.stringify(excludedItems));

        res.json({
            success: true,
            message: message,
            menu: nextMenu
        });
    } catch (err) {
        console.error('메뉴 추천 중 오류 발생:', err.stack);  // 에러 로그 출력
        res.status(500).json({
            success: false,
            message: "메뉴 추천 중 오류 발생",
            error: err.message
        });
    }
};

module.exports = { getFilteredMenu };
