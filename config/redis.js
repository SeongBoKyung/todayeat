const redis = require('redis');

// Redis 클라이언트 생성 (v4 방식)
const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.error('Redis 연결 오류:', err);
});

redisClient.on('connect', () => {
    console.log('Redis에 연결되었습니다.');
});

// Redis 연결된 상태에서만 실행
async function ensureRedisConnected() {
    if (!redisClient.isOpen) {
        await redisClient.connect(); // 명시적으로 연결
    }
}

module.exports = { redisClient, ensureRedisConnected };
