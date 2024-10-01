const Food = require('../models/Food');

let filteredMenu = [];         //조건에 부합하는 음식 리스트
let excludedItemsGlobal = [];  //이미 사용자에게 추천한 음식 리스트 
let lastCategory = null;
let lastPriceRange = null;

const getFilteredMenu = async (req, res) => {
    try{
        const { category, priceRange, distance } = req.query;

        // 필수 파라미터 누락 여부 확인
        let missingParams = [];

        if (!category) {
            missingParams.push("카테고리(category)");
        }
        if (!priceRange) {
            missingParams.push("가격대(priceRange)");
        }
        if (!distance) {
            missingParams.push("거리(distance)");
        }

        if (missingParams.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `${missingParams.join(', ')}가 필요합니다.` 
            });
        }

        //조건이 변경되었을 때
        if (category !== lastCategory || priceRange !== lastPriceRange) {
            console.log('조건이 변경되었습니다. 새로운 검색을 수행합니다.');
            excludedItemsGlobal = [];    //초기화
            lastCategory = category;     //재설정
            lastPriceRange = priceRange; //재설정

            let query = {};

            if (category !== 'all') {
                query.category = { $in: category.split(',') };
            }

            if (priceRange !== 'all') {
                query.price = priceRange; // low, mid, high
            }

            // 필터링된 리스트를 저장
            filteredMenu = await Food.find(query);

            // 필터링된 리스트 로그로 확인
            console.log('필터링된 리스트:', filteredMenu);
        } else {
            console.log('조건이 동일하여 기존 필터링된 리스트를 사용합니다.');
        }

        // 1. 해당 조건에 맞는 음식이 없을 때
        if (filteredMenu.length === 0) {
            return res.json({
                success: false,
                message: "해당 조건을 만족하는 음식이 없습니다."
            });
        }

        let message = "";

        // 2. 남아있는 음식이 없을 때
        if(excludedItemsGlobal.length == filteredMenu.length){
            excludedItemsGlobal = []; 
            message = "설정하신 카테고리의 음식을 모두 확인하셨습니다. 설정하신 카테고리에 맞는 음식들을 재추천합니다."
        }

        //필터링된 리스트에서 아직 보지 않은 음식만 남김
        const remainingMenu = filteredMenu.filter(menu => !excludedItemsGlobal.includes(menu.food_id));
        const nextMenu = remainingMenu[Math.floor(Math.random() * (remainingMenu.length - 1))];
        excludedItemsGlobal.push(nextMenu.food_id);
        console.log('중복없는 리스트:', remainingMenu);
        
        res.json({
            success: true,
            message: message,
            menu: nextMenu
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "메뉴 추천 중 오류 발생",
            error: error.message
        });
    }
};

module.exports = {
    getFilteredMenu
};
