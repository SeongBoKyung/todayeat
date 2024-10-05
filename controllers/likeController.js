const Like = require('../models/Like');
const Dislike = require('../models/Dislike');
const Food = require('../models/Food');

//좋아요
const likeMenu = async (req, res) => {
    const { food_id } = req.body;
    const user_id = req.user.user_id; //jwt에서 추출한 사용자 ID

    try {
        // 좋아요 중복 확인
        const existingLike = await Like.findOne({ user_id, food_id });
        const existingDislike = await Dislike.findOne({ user_id, food_id});

        if(existingLike) {
            return res.status(400).json({ succes: false, message: "이미 좋아요를 누르셨습니다."});
        }

        if(existingDislike) {
            await Dislike.deleteOne({ user_id, food_id }); //싫어요 취소
        }

        const newLike = new Like({ user_id, food_id });
        await newLike.save();

        await Food.updateOne({ food_id }, { $inc: { likes: 1 } });

        res.status(200).json({ success: true, message: '좋아요가 반영되었습니다. 마이 리스트에서 확인하실 수 있습니다.' });
    } catch (err) {
        res.status(500).json({ success: false, message: '좋아요 처리 중 오류 발생', err: err.message });
    }
};

//싫어요 처리
const dislikeMenu = async (req, res) => {
    const { food_id } = req.body;
    const user_id = req.user.user_id;  // JWT에서 추출한 사용자 ID

    try {
        // 싫어요 중복 확인
        const existingDislike = await Dislike.findOne({ user_id, food_id });
        const existingLike = await Like.findOne({ user_id, food_id });

        if (existingDislike) {
            return res.status(400).json({ 
                success: false, 
                message: '이미 싫어요를 누르셨습니다.' 
            });
        }

        if (existingLike) {
            await Like.deleteOne({ user_id, food_id });  // 좋아요 취소
            await Food.updateOne({ food_id }, { $inc: { likes: -1 } });
        }

        // 싫어요 데이터 저장
        const newDislike = new Dislike({ user_id, food_id });
        await newDislike.save();

        res.status(200).json({ 
            success: true, 
            message: '싫어요가 반영되었습니다.' 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: '싫어요 처리 중 오류 발생', err
        });
    }
};

module.exports = { likeMenu, dislikeMenu, getLikedFoods };