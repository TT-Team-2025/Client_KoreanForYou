# KoreanForYou 프로젝트 AWS 배포 완전 가이드

이 문서는 KoreanForYou 프로젝트를 AWS EC2에 Docker를 사용하여 배포한 전체 과정을 기록합니다.

---

## 목차

1. [배포 아키텍처 이해](#1-배포-아키텍처-이해)
2. [AWS EC2 인스턴스 설정](#2-aws-ec2-인스턴스-설정)
3. [Docker 환경 구축](#3-docker-환경-구축)
4. [프로젝트 준비](#4-프로젝트-준비)
5. [배포 실행](#5-배포-실행)
6. [발생한 문제와 해결](#6-발생한-문제와-해결)
7. [배포 후 관리](#7-배포-후-관리)

---

## 1. 배포 아키텍처 이해

### 1.1 왜 클라우드 배포가 필요한가?

**로컬 개발 환경**
- `localhost:3000` - 본인 컴퓨터에서만 접속 가능
- 컴퓨터를 끄면 서비스 중단
- 외부에서 접속 불가능

**클라우드 배포 후**
- `http://3.106.179.223` - 전 세계 어디서나 접속 가능
- 24시간 365일 서비스 제공
- 실제 사용자들이 이용 가능

### 1.2 배포 구조

```
인터넷
  ↓
AWS EC2 (Public IP: 3.106.179.223)
  ↓
Docker Containers
  ├── Frontend (React + Nginx) :80
  ├── Backend (FastAPI) :8000
  ├── PostgreSQL Database :5432
  └── Redis Cache :6379
```

**각 컴포넌트의 역할:**
- **Frontend (Nginx)**: 사용자에게 웹페이지 제공, API 요청을 백엔드로 프록시
- **Backend (FastAPI)**: 비즈니스 로직 처리, 데이터베이스 연동
- **PostgreSQL**: 사용자 데이터, 학습 데이터 저장
- **Redis**: 세션, 캐시 데이터 저장

### 1.3 왜 Docker를 사용하나?

**Docker 없이 배포**
```bash
# 각각 수동 설치
sudo apt install python3.11
sudo apt install postgresql-16
sudo apt install redis
sudo apt install nginx
# 환경 설정, 포트 충돌 해결, 의존성 관리...
```

**Docker로 배포**
```bash
# 한 번에 모든 환경 구성
docker-compose up -d
```

**Docker의 장점:**
1. **일관성**: 개발 환경과 프로덕션 환경이 동일
2. **격리**: 각 서비스가 독립된 컨테이너에서 실행
3. **이식성**: 어떤 서버에서도 동일하게 작동
4. **확장성**: 필요시 컨테이너 복제로 쉽게 확장

---

## 2. AWS EC2 인스턴스 설정

### 2.1 EC2 인스턴스 생성

**왜 EC2인가?**
- AWS의 가상 서버 서비스
- 필요한 만큼만 컴퓨팅 자원 사용 (비용 효율적)
- 전 세계 데이터센터에 배포 가능
- 자동 확장, 모니터링 등 부가 기능

**생성한 인스턴스 정보:**
- **AMI**: Ubuntu Server 22.04 LTS
- **인스턴스 타입**: t3.medium (2 vCPU, 4GB RAM)
- **스토리지**: 30GB (처음 8GB였으나 부족하여 확장)
- **Public IP**: 3.106.179.223

**왜 Ubuntu 22.04를 선택했나?**
- LTS (Long Term Support) 버전으로 안정적
- Docker 공식 지원
- 커뮤니티가 활발하여 문제 해결 용이

### 2.2 보안 그룹 설정

```
포트 22 (SSH)     → EC2 접속용
포트 80 (HTTP)    → 웹사이트 접속용
포트 443 (HTTPS)  → 보안 웹사이트 접속용 (향후)
포트 8000         → 백엔드 API (개발/디버깅용)
```

**왜 이 포트들을 열었나?**
- **22**: 서버 관리를 위한 SSH 접속
- **80/443**: 사용자들이 웹사이트에 접속하기 위함
- **8000**: 백엔드 API 직접 테스트용 (프로덕션에서는 닫는 것 권장)

### 2.3 Elastic IP 할당

**왜 Elastic IP가 필요한가?**

일반 EC2 Public IP는 인스턴스를 재시작하면 변경됩니다:
```
재시작 전: http://3.106.179.223
재시작 후: http://54.123.45.67  ← 변경됨!
```

Elastic IP는 고정 IP를 제공하여 재시작해도 동일한 주소를 유지합니다.

**비용**: 인스턴스에 연결되어 있으면 무료, 미사용 시 요금 부과

### 2.4 스토리지 확장 (8GB → 30GB)

**왜 확장이 필요했나?**

Docker 이미지 빌드 중 디스크 공간 부족 에러 발생:
```
no space left on device
```

**사용 공간 분석:**
- Docker 이미지: ~5GB
- 백엔드 Python 패키지: ~2GB
- 프론트엔드 빌드: ~1GB
- 시스템 파일: ~1GB
- **총 필요 공간**: 최소 20GB 이상

**확장 과정:**
```bash
# AWS Console에서 볼륨 크기 8GB → 30GB로 수정

# EC2에서 파티션 확장
sudo growpart /dev/nvme0n1 1

# 파일시스템 확장
sudo resize2fs /dev/nvme0n1p1

# 확인
df -h
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/nvme0n1p1   30G  6.5G   23G  23% /
```

---

## 3. Docker 환경 구축

### 3.1 Docker 설치

**왜 이 순서로 설치하나?**

```bash
# 1. 필수 패키지 설치
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
```
- `apt-transport-https`: HTTPS를 통한 패키지 다운로드
- `ca-certificates`: SSL 인증서 검증
- `curl`: 파일 다운로드 도구

```bash
# 2. Docker GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```
**이유**: 다운로드하는 Docker 패키지가 공식 버전인지 검증하기 위함

```bash
# 3. Docker 리포지토리 추가
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
**이유**: Ubuntu 기본 저장소가 아닌 Docker 공식 저장소에서 최신 버전 설치

```bash
# 4. Docker 설치
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io
```

```bash
# 5. Docker 서비스 시작 및 자동 시작 설정
sudo systemctl start docker
sudo systemctl enable docker
```
**이유**: 서버 재부팅 시 Docker가 자동으로 시작되도록 설정

### 3.2 Docker 권한 설정

**문제 상황:**
```bash
docker ps
# permission denied while trying to connect to the Docker daemon socket
```

**왜 발생하나?**
- Docker 소켓(`/var/run/docker.sock`)은 root 권한 필요
- 일반 사용자는 접근 불가

**해결:**
```bash
# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 그룹 적용 (재로그인 대신)
newgrp docker

# 확인
docker ps  # sudo 없이 실행 가능!
```

### 3.3 Docker Compose 설치

**왜 Docker Compose가 필요한가?**

**Docker만 사용:**
```bash
docker run -d postgres
docker run -d redis
docker run -d backend
docker run -d frontend
# 각각 수동으로 실행, 네트워크 연결 설정, 환경 변수 전달...
```

**Docker Compose 사용:**
```bash
docker-compose up -d
# 모든 서비스 한 번에 실행, 네트워크 자동 구성!
```

**설치:**
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

---

## 4. 프로젝트 준비

### 4.1 프로젝트 클론

```bash
# 홈 디렉토리로 이동
cd ~

# 프론트엔드 클론
git clone https://github.com/TT-Team-2025/Front_KoreanForYou.git
cd Front_KoreanForYou
git checkout develop  # ← 중요! main은 비어있음
cd ~

# 백엔드 클론
git clone https://github.com/TT-Team-2025/Server_KoreanForYou.git
cd Server_KoreanForYou
git checkout develop  # 필요한 경우
cd ~
```

**왜 develop 브랜치를 사용하나?**
- `main` 브랜치: 비어있음 (배포 준비 중)
- `develop` 브랜치: 실제 개발 코드가 있음

**최종 디렉토리 구조:**
```
/home/ubuntu/
├── Front_KoreanForYou/  (develop 브랜치)
│   ├── src/
│   ├── docker-compose.prod.yml
│   ├── .env.production
│   └── nginx.conf
└── Server_KoreanForYou/ (백엔드)
    ├── app/
    └── Dockerfile
```

### 4.2 환경 변수 파일 생성 (.env.production)

**왜 환경 변수 파일이 필요한가?**

개발 환경과 프로덕션 환경은 다른 설정이 필요합니다:

| 항목 | 개발 환경 | 프로덕션 환경 |
|------|-----------|---------------|
| DB 비밀번호 | `password` (단순) | `KoreanForYou2025SecurePass` (강력) |
| DEBUG 모드 | `True` | `False` |
| 데이터베이스 | 로컬 SQLite | PostgreSQL |
| 로그 레벨 | DEBUG | WARNING |

**`.env.production` 파일 내용:**
```bash
# ===================================
# Docker Compose 프로덕션 환경 변수
# ===================================

# Database Configuration (PostgreSQL 컨테이너용)
POSTGRES_USER=koreanforyou_user
POSTGRES_PASSWORD=KoreanForYou2025SecurePass
POSTGRES_DB=koreanforyou

# OpenAI API 설정
OPENAI_API_KEY=sk-proj-xxxxx...
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1

# ReturnZero (VITO) 설정
RETURN_ZERO_CLIENT_ID=IGGXkz2LBtExDB7WXflH
RETURN_ZERO_CLIENT_SECRET=bQJh8SRFCyiZhHdAFqcWr8wGbVHdClOTKLbQrRdE

# Clova Voice 설정
CLOVA_VOICE_CLIENT_ID=66ax3njp1n
CLOVA_VOICE_CLIENT_SECRET=hiWHtY4zqSDRMgQrcwSNWTBOxmCUAisji68u8PTv
```

**⚠️ 보안 주의사항:**
```bash
# .gitignore에 추가되어 Git에 커밋되지 않음
.env.production
*.env.production
```

**이유**: API 키가 GitHub에 공개되면 악용될 수 있음!

### 4.3 docker-compose.prod.yml 작성

**개발용 vs 프로덕션용 차이:**

| 항목 | 개발용 (`docker-compose.yml`) | 프로덕션용 (`docker-compose.prod.yml`) |
|------|-------------------------------|----------------------------------------|
| 재시작 정책 | 없음 | `restart: unless-stopped` |
| 환경 변수 | 하드코딩 | `.env.production` 파일에서 로드 |
| 볼륨 마운트 | 소스 코드 마운트 (실시간 반영) | 빌드된 이미지만 사용 |
| 백엔드 실행 | `--reload` (코드 변경 시 재시작) | `--workers 4` (멀티 프로세스) |
| 로그 | 무제한 | 로그 로테이션 (10MB, 3개 파일) |

**`docker-compose.prod.yml` 주요 내용:**

```yaml
services:
  # PostgreSQL
  db:
    image: postgres:16
    container_name: koreanforyou_db
    restart: unless-stopped  # ← 서버 재부팅 시 자동 시작
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-koreanforyou}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data  # ← 데이터 영속성
    healthcheck:  # ← DB가 준비될 때까지 대기
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # FastAPI 백엔드
  backend:
    build:
      context: ../Server_KoreanForYou
      dockerfile: Dockerfile
    container_name: koreanforyou_backend
    restart: unless-stopped
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
    # ↑ 프로덕션: --workers 4 (멀티 프로세스)
    # 개발: --reload (코드 변경 자동 반영)
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      # ↑ db:5432 = Docker 네트워크 내부 호스트명
    depends_on:
      db:
        condition: service_healthy  # ← DB가 준비된 후 시작
      redis:
        condition: service_healthy
    logging:  # ← 로그 로테이션
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # 프론트엔드 (Nginx)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: koreanforyou_frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro

volumes:
  postgres_data:  # ← Docker 볼륨 (데이터 영속성)
  redis_data:
```

### 4.4 Nginx 설정 (nginx.conf)

**왜 Nginx가 필요한가?**

**Nginx 없이:**
```
사용자 → React Dev Server (localhost:3000) ← 개발 환경에서만 가능
```

**Nginx 사용:**
```
사용자 → Nginx (정적 파일 제공 + API 프록시) → Backend
```

**Nginx의 역할:**
1. **정적 파일 제공**: React 빌드 파일 (HTML, CSS, JS) 제공
2. **API 프록시**: `/api/*` 요청을 백엔드로 전달
3. **캐싱**: 정적 파일 캐싱으로 성능 향상
4. **보안**: 보안 헤더 추가, HTTPS 지원

**`nginx.conf` 주요 설정:**

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # API 프록시 설정 (백엔드 서버로 전달)
    location /api/ {
        proxy_pass http://backend:8000/;
        # ↑ 중요! 컨테이너 이름 'backend'를 호스트명으로 사용

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # AI 처리 시간 고려한 타임아웃
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # React Router (SPA) 설정
    location / {
        try_files $uri $uri/ /index.html;
        # ↑ 모든 경로를 index.html로 리다이렉트 (클라이언트 사이드 라우팅)
    }

    # 정적 파일 캐싱
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**프록시 설정이 중요한 이유:**

프론트엔드에서 API 호출:
```javascript
// src/api/client.ts
const BASE_URL = '/api';  // 상대 경로

apiClient.get('/api/users/')
```

Nginx가 프록시:
```
브라우저: GET http://3.106.179.223/api/users/
    ↓
Nginx: /api/ 요청 감지
    ↓
Backend: http://backend:8000/users/ 로 전달
```

---

## 5. 배포 실행

### 5.1 배포 명령어

```bash
cd ~/Front_KoreanForYou

# 백그라운드로 빌드 및 실행
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

**명령어 분석:**
- `sudo`: Docker 소켓 접근 권한
- `docker-compose`: 여러 컨테이너를 한 번에 관리
- `-f docker-compose.prod.yml`: 프로덕션 설정 파일 지정
- `--env-file .env.production`: 환경 변수 파일 지정
- `up`: 컨테이너 생성 및 시작
- `-d`: 백그라운드 실행 (detached mode)
- `--build`: 이미지를 새로 빌드

### 5.2 실행 과정

```
[+] Building 234.5s (23/23) FINISHED
 => [backend] Building...
 => [frontend] Building...
 => [db] Pulling image postgres:16
 => [redis] Pulling image redis:7-alpine

[+] Running 9/9
 ✔ Network front_koreanforyou_default       Created
 ✔ Volume front_koreanforyou_postgres_data  Created
 ✔ Volume front_koreanforyou_redis_data     Created
 ✔ Container koreanforyou_redis             Healthy (11.5s)
 ✔ Container koreanforyou_db                Healthy (11.5s)
 ✔ Container koreanforyou_backend           Started (11.6s)
 ✔ Container koreanforyou_frontend          Started (12.0s)
```

**각 단계 설명:**
1. **Building**: Dockerfile을 기반으로 이미지 빌드
2. **Pulling**: Docker Hub에서 공식 이미지 다운로드
3. **Network Created**: 컨테이너 간 통신을 위한 가상 네트워크 생성
4. **Volume Created**: 데이터 영속성을 위한 볼륨 생성
5. **Healthy**: 헬스체크 통과 (DB, Redis 준비 완료)
6. **Started**: 컨테이너 실행

### 5.3 배포 확인

```bash
# 컨테이너 상태 확인
docker ps

CONTAINER ID   IMAGE                          STATUS         PORTS
abc123def456   front_koreanforyou-frontend    Up 2 minutes   0.0.0.0:80->80/tcp
def456ghi789   front_koreanforyou-backend     Up 2 minutes   0.0.0.0:8000->8000/tcp
ghi789jkl012   postgres:16                    Up 2 minutes   0.0.0.0:5432->5432/tcp
jkl012mno345   redis:7-alpine                 Up 2 minutes   0.0.0.0:6379->6379/tcp
```

```bash
# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f

# 백엔드 API 테스트
curl http://localhost:8000/
# {"message":"KoreanForYou API Server","version":"1.0.0","docs":"/docs"}

# 프론트엔드 테스트
curl http://localhost:80
# <!DOCTYPE html>...<title>KoreanForYou</title>...
```

```bash
# 브라우저에서 접속
http://3.106.179.223          # 프론트엔드
http://3.106.179.223:8000/docs # 백엔드 API 문서
```

---

## 6. 발생한 문제와 해결

### 6.1 Docker 권한 문제

**문제:**
```bash
docker-compose up
# permission denied while trying to connect to the Docker daemon socket
```

**원인:**
- Docker 소켓은 root 권한 필요
- 일반 사용자는 접근 불가

**해결:**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

**왜 이렇게 해야 하나?**
- `usermod -aG docker $USER`: 사용자를 docker 그룹에 추가
- `newgrp docker`: 로그아웃 없이 그룹 변경사항 적용

---

### 6.2 디스크 공간 부족

**문제:**
```
failed to solve: failed to extract layer: write /var/lib/containerd: no space left on device
```

**원인:**
- EC2 볼륨 크기: 8GB (너무 작음)
- Docker 이미지 빌드 중 공간 부족

**해결:**
```bash
# AWS Console에서 볼륨 크기 30GB로 확장

# EC2에서 파티션 확장
sudo growpart /dev/nvme0n1 1
sudo resize2fs /dev/nvme0n1p1

# 확인
df -h
# /dev/nvme0n1p1   30G  6.5G   23G  23% /
```

**왜 30GB를 선택했나?**
- Docker 이미지: ~5GB
- 백엔드 의존성: ~2GB
- 프론트엔드 빌드: ~1GB
- 여유 공간: ~20GB

---

### 6.3 데이터베이스 연결 실패 (비밀번호 특수문자 문제)

**문제:**
```
socket.gaierror: [Errno -2] Name or service not known
asyncpg.exceptions.InvalidPasswordError: password authentication failed for user "koreanforyou_user"
```

**원인:**
```bash
POSTGRES_PASSWORD=SecurePassword123!@#
```

비밀번호에 `@` 문자가 포함되어 URL 파싱 실패:
```
postgresql+asyncpg://user:SecurePassword123!@#@db:5432/koreanforyou
                                            ↑
                                        호스트 구분자로 인식됨
```

**해결:**
```bash
# 특수문자 없는 비밀번호로 변경
POSTGRES_PASSWORD=KoreanForYou2025SecurePass

# 볼륨 삭제 후 재생성 (기존 DB 비밀번호 초기화)
sudo docker-compose -f docker-compose.prod.yml down -v
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

**왜 `-v` 플래그가 필요한가?**
- PostgreSQL 컨테이너는 처음 생성 시 비밀번호 설정
- `.env` 파일을 변경해도 기존 DB 비밀번호는 변경되지 않음
- 볼륨을 삭제해야 DB가 새로운 비밀번호로 초기화됨

**⚠️ 주의:**
`-v` 플래그는 **모든 데이터베이스 데이터를 삭제**합니다!
프로덕션 환경에서는 신중하게 사용해야 합니다.

---

### 6.4 Nginx 프록시 설정 오류

**문제:**
```bash
docker logs koreanforyou_frontend
# nginx: [emerg] host not found in upstream "koreanforyou_backend"
```

**원인:**
```nginx
# 잘못된 설정
location /api/ {
    proxy_pass http://koreanforyou_backend:8000;
    # ↑ 컨테이너 이름이 틀림
}
```

**해결:**
```nginx
# 올바른 설정
location /api/ {
    proxy_pass http://backend:8000/;
    # ↑ docker-compose.yml의 서비스 이름 사용
}
```

**왜 이렇게 해야 하나?**

Docker Compose는 자동으로 네트워크를 생성하고, 서비스 이름을 DNS로 등록:
```yaml
services:
  backend:  # ← 이 이름이 호스트명이 됨
    container_name: koreanforyou_backend
```

Nginx 컨테이너 내부에서:
```bash
ping backend  # ✅ 성공
ping koreanforyou_backend  # ❌ 실패 (컨테이너 이름은 DNS에 등록 안됨)
```

---

### 6.5 프론트엔드 500 에러

**문제:**
브라우저에서 로그인 시도:
```
AxiosError: Request failed with status code 500
```

**원인:**
위의 모든 문제가 복합적으로 작용:
1. Nginx 프록시 설정 오류 → 백엔드에 요청 전달 안됨
2. 데이터베이스 연결 실패 → 백엔드에서 500 에러 반환

**해결:**
1. Nginx 설정 수정
2. DB 비밀번호 수정 및 볼륨 재생성
3. 컨테이너 재시작

```bash
sudo docker-compose -f docker-compose.prod.yml down -v
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

---

## 7. 배포 후 관리

### 7.1 로그 확인

```bash
# 모든 서비스 로그
docker-compose -f docker-compose.prod.yml logs

# 실시간 로그
docker-compose -f docker-compose.prod.yml logs -f

# 특정 서비스 로그
docker logs koreanforyou_backend --tail 100
docker logs koreanforyou_frontend -f

# 로그 필터링
docker logs koreanforyou_backend 2>&1 | grep ERROR
```

### 7.2 컨테이너 관리

```bash
# 컨테이너 상태 확인
docker ps -a

# 컨테이너 재시작
docker-compose -f docker-compose.prod.yml restart backend

# 컨테이너 중지
docker-compose -f docker-compose.prod.yml stop

# 컨테이너 시작
docker-compose -f docker-compose.prod.yml start

# 모든 컨테이너 중지 및 삭제
docker-compose -f docker-compose.prod.yml down

# 볼륨까지 삭제 (데이터 삭제!)
docker-compose -f docker-compose.prod.yml down -v
```

### 7.3 시스템 리소스 모니터링

```bash
# Docker 컨테이너 리소스 사용량
docker stats

CONTAINER ID   NAME                      CPU %     MEM USAGE / LIMIT     MEM %
abc123def456   koreanforyou_frontend     0.05%     50MiB / 3.8GiB        1.29%
def456ghi789   koreanforyou_backend      2.50%     150MiB / 3.8GiB       3.86%
ghi789jkl012   koreanforyou_db           0.20%     100MiB / 3.8GiB       2.57%
jkl012mno345   koreanforyou_redis        0.01%     10MiB / 3.8GiB        0.26%

# 디스크 사용량
df -h
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/nvme0n1p1   30G  8.5G   21G  29% /

# 메모리 사용량
free -h
#                total        used        free      shared
# Mem:           3.8Gi       1.2Gi       2.0Gi       50Mi
```

### 7.4 업데이트 배포

코드를 수정하고 다시 배포:

```bash
# 1. EC2 접속
ssh -i ~/Downloads/koreanforyou-key.pem ubuntu@3.106.179.223

# 2. 코드 업데이트
cd ~/Front_KoreanForYou
git pull origin develop

cd ~/Server_KoreanForYou
git pull origin develop

# 3. 재배포
cd ~/Front_KoreanForYou
sudo docker-compose -f docker-compose.prod.yml down
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# 4. 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

### 7.5 데이터베이스 백업

```bash
# 데이터베이스 백업
docker exec koreanforyou_db pg_dump -U koreanforyou_user koreanforyou > backup_$(date +%Y%m%d).sql

# 백업 복원
docker exec -i koreanforyou_db psql -U koreanforyou_user koreanforyou < backup_20251117.sql
```

### 7.6 디스크 정리

```bash
# 사용하지 않는 Docker 리소스 정리
docker system prune -a -f

# 볼륨 정리
docker volume prune -f

# 로그 파일 정리
sudo journalctl --vacuum-time=7d
```

---

## 8. 추가 개선 사항 (향후)

### 8.1 HTTPS 설정 (Let's Encrypt)

**현재:**
```
http://3.106.179.223  ← 암호화되지 않음
```

**개선 후:**
```
https://koreanforyou.com  ← SSL 인증서로 암호화
```

**설정 방법:**
```bash
# Certbot 설치
sudo apt install -y certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot certonly --nginx -d koreanforyou.com -d www.koreanforyou.com

# Nginx 설정 업데이트
server {
    listen 443 ssl http2;
    server_name koreanforyou.com;

    ssl_certificate /etc/letsencrypt/live/koreanforyou.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/koreanforyou.com/privkey.pem;

    # ... 나머지 설정
}

# 자동 갱신 설정
sudo crontab -e
0 0 1 * * certbot renew --quiet && docker-compose restart frontend
```

### 8.2 CI/CD 파이프라인 (GitHub Actions)

**현재:**
```
코드 수정 → 수동으로 EC2 접속 → git pull → 재배포
```

**개선 후:**
```
코드 푸시 → GitHub Actions 자동 실행 → 자동 배포
```

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to AWS EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/Front_KoreanForYou
            git pull origin main
            docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

### 8.3 모니터링 (Prometheus + Grafana)

**현재:**
```bash
docker stats  # 수동으로 확인
```

**개선 후:**
- 실시간 대시보드
- 알림 설정 (메모리 90% 초과 시 이메일 발송)
- 성능 지표 시각화

### 8.4 로드 밸런싱 및 오토 스케일링

**현재:**
```
사용자 → EC2 1대
```

**개선 후:**
```
사용자 → AWS ALB → EC2 Auto Scaling Group (1~5대)
```

---

## 9. 비용 분석

### 9.1 월간 AWS 비용 예상

| 리소스 | 사양 | 월간 비용 (USD) |
|--------|------|-----------------|
| EC2 t3.medium | 2 vCPU, 4GB RAM | ~$30 |
| EBS gp3 | 30GB | ~$3 |
| Elastic IP | 1개 (연결 시) | 무료 |
| 데이터 전송 | ~100GB/월 | ~$9 |
| **총 예상 비용** | | **~$42/월** |

### 9.2 비용 절감 방법

1. **Reserved Instance**: 1년 약정 시 ~40% 할인
2. **Spot Instance**: 최대 90% 할인 (중단될 수 있음)
3. **AWS Free Tier**: 신규 가입 시 12개월 무료 (t2.micro)

---

## 10. 트러블슈팅 체크리스트

### 배포가 실패하는 경우

**1단계: 컨테이너 상태 확인**
```bash
docker ps -a
# STATUS가 "Restarting" 또는 "Exited"인지 확인
```

**2단계: 로그 확인**
```bash
docker logs <container_name> --tail 100
# 에러 메시지 확인
```

**3단계: 환경 변수 확인**
```bash
docker exec <container_name> env
# 필요한 환경 변수가 모두 설정되었는지 확인
```

**4단계: 네트워크 확인**
```bash
docker network inspect front_koreanforyou_default
# 모든 컨테이너가 같은 네트워크에 있는지 확인
```

**5단계: 디스크 공간 확인**
```bash
df -h
# Use%가 90% 이상이면 디스크 정리 필요
```

### 일반적인 에러 메시지와 해결

| 에러 메시지 | 원인 | 해결 |
|-------------|------|------|
| `permission denied` | Docker 권한 없음 | `sudo usermod -aG docker $USER` |
| `no space left on device` | 디스크 공간 부족 | `docker system prune -a` 또는 볼륨 확장 |
| `port is already allocated` | 포트 충돌 | `docker ps -a` 확인 후 중복 컨테이너 삭제 |
| `password authentication failed` | DB 비밀번호 불일치 | `.env` 파일 확인 후 `down -v` → `up` |
| `host not found in upstream` | Nginx 설정 오류 | `nginx.conf`의 `proxy_pass` 호스트명 확인 |

---

## 11. 참고 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [Docker Compose 가이드](https://docs.docker.com/compose/)
- [AWS EC2 문서](https://docs.aws.amazon.com/ec2/)
- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)

---

## 12. 요약

### 배포 아키텍처
```
인터넷
  ↓
AWS EC2 (3.106.179.223)
  ↓
Docker Network
  ├── Nginx (Frontend) :80
  ├── FastAPI (Backend) :8000
  ├── PostgreSQL :5432
  └── Redis :6379
```

### 핵심 명령어
```bash
# 배포
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# 중지
sudo docker-compose -f docker-compose.prod.yml down

# 재시작
sudo docker-compose -f docker-compose.prod.yml restart

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f

# 상태 확인
docker ps
```

### 주요 학습 내용

1. **클라우드 배포의 필요성**: 로컬 환경과 프로덕션 환경의 차이
2. **Docker의 장점**: 일관된 환경, 격리, 이식성
3. **환경 변수 관리**: 개발/프로덕션 분리의 중요성
4. **Nginx 프록시**: SPA 라우팅, API 프록시, 정적 파일 제공
5. **데이터 영속성**: Docker 볼륨의 중요성
6. **모니터링**: 로그, 리소스 사용량 확인
7. **트러블슈팅**: 에러 원인 파악 및 해결 방법

---

**작성일**: 2025-11-17
**작성자**: Claude Code
**프로젝트**: KoreanForYou
**배포 환경**: AWS EC2 (Ubuntu 22.04) + Docker Compose
