const Like = require('../models/Like');
const Dislike = require('../models/Dislike');
const Food = require('../models/Food');

// 좋아요
const likeMenu = async (req, res) => {
    const { food_id } = req.body;
    const user_id = req.user.user_id;

    try {
        const existingLike = await Like.findOne({ user_id, food_id });
        const existingDislike = await Dislike.findOne({ user_id, food_id});

        if(existingLike) { // 좋아요 해놓은 음식일 경우 => 좋아요 취소
            await Like.deleteOne({ user_id, food_id });
            await Food.updateOne({ food_id }, { $inc: { likes: -1 } });
            return res.status(200).json({ success: true, message: '좋아요가 취소되었습니다.' });
        }else{ // 좋아요 안 해놓은 음식일 경우 => 좋아요 적용
            if(existingDislike) {  // 같은 음식 싫어요 눌러놨을 경우 => 싫어요 취소
                await Dislike.deleteOne({ user_id, food_id });
            }

            const newLike = new Like({ user_id, food_id });
            await newLike.save();

            await Food.updateOne({ food_id }, { $inc: { likes: 1 } });

            res.status(200).json({ success: true, message: '좋아요가 반영되었습니다. 마이 리스트에서 확인하실 수 있습니다.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: '좋아요 처리 중 오류 발생', err: err.message });
    }
};

// 싫어요
const dislikeMenu = async (req, res) => {
    const { food_id } = req.body;
    const user_id = req.user.user_id;

    try {
        const existingDislike = await Dislike.findOne({ user_id, food_id });
        const existingLike = await Like.findOne({ user_id, food_id });

        if (existingDislike) {  // 싫어요 해놓은 음식일 경우 => 싫어요 취소
            await Dislike.deleteOne({ user_id, food_id });
            return res.status(200).json({ success: true, message: '싫어요가 취소되었습니다.' });
        } else { // 싫어요 안 해놓은 음식일 경우 => 싫어요 적용
            if (existingLike) { // 같은 음식 좋아요 눌러놨을 경우 => 좋아요 취소
                await Like.deleteOne({ user_id, food_id });
                await Food.updateOne({ food_id }, { $inc: { likes: -1 } });
            }

            const newDislike = new Dislike({ user_id, food_id });
            await newDislike.save();

            return res.status(200).json({ success: true, message: '싫어요가 반영되었습니다.' });
        }
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: '싫어요 처리 중 오류 발생', err
        });
    }
};

// 좋아요 누른 음식 리스트
const getLikedFoods = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const likedItems = await Like.find({ user_id });

        // 좋아요 누른 음식이 없을 경우
        if (likedItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "좋아요 누른 음식이 없습니다."
            });
        }

        const foodIds = likedItems.map(item => item.food_id);

        const likedFoods = await Food.find({ food_id: { $in: foodIds } });

        res.status(200).json({
            success: true,
            data: likedFoods
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: '좋아요 리스트 조회 중 오류 발생',
            error: err.message
        });
    }
};

module.exports = { likeMenu, dislikeMenu, getLikedFoods };