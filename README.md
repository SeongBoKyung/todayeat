투데잇 (TodayEat) - 음식 추천 서비스
투데잇은 사용자의 기호에 맞는 음식을 추천하고, 음식에 대한 좋아요/싫어요 기능을 제공하는 서비스입니다. 사용자는 카카오 로그인을 통해 서비스에 접근할 수 있으며, 추천 받은 음식에 좋아요/싫어요를 남길 수 있습니다. 또한, 사용자가 싫어요를 남긴 음식은 다음 추천에서 제외됩니다.

주요 기능
카카오 로그인

사용자는 카카오 계정을 통해 로그인할 수 있습니다.
로그인 시, 사용자 고유 ID와 계정 생성 일자만 저장합니다.
음식 추천

카테고리, 가격대, 거리 등의 필터를 적용해 음식 추천이 가능합니다.
로그인하지 않은 사용자는 일반적인 추천을 받을 수 있고, 로그인한 사용자는 싫어요 리스트를 반영한 맞춤 추천을 받습니다.
좋아요/싫어요 기능

음식에 대해 좋아요/싫어요를 표시할 수 있습니다.
좋아요는 음식에 대한 긍정적인 피드백을, 싫어요는 음식을 추천에서 제외하는 기능을 제공합니다.
이미 좋아요/싫어요 한 음식에 대해 다시 버튼을 누르면 취소됩니다.
캐싱 및 성능 최적화

Redis를 이용해 추천 음식 리스트와 중복 방지 리스트를 캐싱하여 성능을 향상시켰습니다.
Redis 캐시를 사용해 싫어요 리스트를 관리하고, 사용자 맞춤 추천을 빠르게 처리합니다.
MongoDB 클라우드와 AWS S3

음식 이미지 데이터는 AWS S3에 저장되어 있으며, MongoDB에 해당 이미지의 URL이 저장됩니다.
클라우드 MongoDB를 이용해 DB를 로컬 환경이 아닌 클라우드에 저장합니다.
기술 스택
Backend: Node.js, Express.js
Database: MongoDB (Atlas 클라우드 DB 사용)
Caching: Redis
Authentication: Kakao OAuth 2.0
Cloud Storage: AWS S3 (음식 이미지 저장)
Deployment: 로컬 개발용, 배포는 없음
설치 및 실행 방법
1. Clone the repository
bash
Copy code
git clone https://github.com/username/todayeat.git
cd todayeat
2. 패키지 설치
bash
Copy code
npm install
3. 환경 변수 설정
config.env 파일을 프로젝트 루트에 생성하고 다음 환경 변수를 추가합니다:

makefile
Copy code
PORT=3000
MONGODB_URI=your_mongodb_cloud_uri
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
JWT_SECRET=your_jwt_secret
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret
KAKAO_REDIRECT_URI=http://localhost:3000/auth/login/callback
AWS_S3_BUCKET=your_s3_bucket_name
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
4. 서버 실행
bash
Copy code
npm run dev
서버가 http://localhost:3000 에서 실행됩니다.

API 설명
1. 로그인
POST /auth/login
카카오 로그인 페이지로 리다이렉트되어 로그인 후 callback을 처리합니다.
2. 메뉴 추천
GET /menu/recommend?category=한식&priceRange=low&distance=1000
카테고리, 가격대, 거리 조건에 맞는 음식 추천 리스트를 제공합니다.
3. 좋아요/싫어요
POST /menu/like
사용자가 음식에 좋아요를 누릅니다.
POST /menu/dislike
사용자가 음식에 싫어요를 누릅니다.
GET /menu/likes
사용자가 좋아요 누른 음식 리스트를 제공합니다.
4. 로그아웃 및 회원 탈퇴
POST /auth/logout
카카오 계정 로그아웃.
DELETE /auth/delete
회원 탈퇴와 동시에 좋아요/싫어요 기록 삭제.
프로젝트 구조
bash
Copy code
├── controllers
│   ├── authController.js  # 로그인/회원 탈퇴 관련 로직
│   ├── menuController.js  # 음식 추천 관련 로직
│   ├── likeController.js  # 좋아요/싫어요 관련 로직
├── models
│   ├── User.js  # 사용자 모델
│   ├── Food.js  # 음식 모델
│   ├── Like.js  # 좋아요 모델
│   ├── Dislike.js  # 싫어요 모델
├── routes
│   ├── authRoutes.js  # 로그인/회원탈퇴 라우트
│   ├── menuRoutes.js  # 음식 추천/좋아요/싫어요 라우트
├── config
│   └── redis.js  # Redis 설정
├── index.js  # 서버 엔트리 포인트
└── README.md
To-Do (추가 가능 기능)
음식에 대한 리뷰 및 별점 기능 추가
음식에 대한 필터링 기능 고도화
추천 알고리즘 개선 및 개인화 추천 강화
라이센스
이 프로젝트는 MIT 라이센스를 따릅니다.

