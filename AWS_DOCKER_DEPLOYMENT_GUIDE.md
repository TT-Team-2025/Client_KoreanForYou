# AWS + Docker 배포 가이드

이 문서는 KoreanForYou 프로젝트를 AWS와 Docker를 사용하여 배포하는 방법을 상세히 설명합니다.

## 목차

1. [사전 준비사항](#1-사전-준비사항)
2. [AWS 계정 설정](#2-aws-계정-설정)
3. [EC2 인스턴스 생성 및 설정](#3-ec2-인스턴스-생성-및-설정)
4. [Docker 설치](#4-docker-설치)
5. [프로젝트 배포](#5-프로젝트-배포)
6. [도메인 및 HTTPS 설정](#6-도메인-및-https-설정)
7. [CI/CD 파이프라인 구축](#7-cicd-파이프라인-구축)
8. [모니터링 및 로깅](#8-모니터링-및-로깅)
9. [트러블슈팅](#9-트러블슈팅)

---

## 1. 사전 준비사항

### 필수 요구사항
- AWS 계정
- 도메인 (선택사항, Route 53 또는 외부 DNS 사용)
- Git 설치
- 기본적인 Linux 명령어 지식
- SSH 클라이언트

### 준비해야 할 환경 변수
다음 환경 변수들을 미리 준비하세요:
```bash
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
RETURN_ZERO_CLIENT_ID=your_vito_client_id
RETURN_ZERO_CLIENT_SECRET=your_vito_secret
CLOVA_VOICE_CLIENT_ID=your_clova_client_id
CLOVA_VOICE_CLIENT_SECRET=your_clova_secret
POSTGRES_PASSWORD=secure_password_here
POSTGRES_USER=your_db_user
POSTGRES_DB=koreanforyou
```

---

## 2. AWS 계정 설정

### 2.1 AWS 계정 생성
1. [AWS 웹사이트](https://aws.amazon.com)에 접속
2. "계정 생성" 클릭
3. 이메일, 비밀번호, 결제 정보 입력
4. 신원 확인 완료

### 2.2 IAM 사용자 생성 (보안 모범 사례)
1. AWS Console → IAM 서비스 접속
2. "사용자" → "사용자 추가" 클릭
3. 사용자 이름 입력 (예: `deploy-user`)
4. 액세스 유형: "프로그래밍 방식 액세스" 선택
5. 권한 설정:
   - `AmazonEC2FullAccess`
   - `AmazonVPCFullAccess`
   - `AmazonRoute53FullAccess` (도메인 사용 시)
   - `CloudWatchFullAccess` (모니터링용)
6. Access Key와 Secret Key를 안전하게 저장

---

## 3. EC2 인스턴스 생성 및 설정

### 3.1 EC2 인스턴스 시작

#### 1단계: AMI 선택
1. AWS Console → EC2 → "인스턴스 시작" 클릭
2. **AMI 선택**: Ubuntu Server 22.04 LTS (추천)
   - 64비트 (x86)

#### 2단계: 인스턴스 유형 선택
프로젝트 규모에 따라 선택:
- **개발/테스트**: `t3.small` (2 vCPU, 2GB RAM) - 약 $15/월
- **소규모 프로덕션**: `t3.medium` (2 vCPU, 4GB RAM) - 약 $30/월
- **중규모 프로덕션**: `t3.large` (2 vCPU, 8GB RAM) - 약 $60/월

**추천**: PostgreSQL, Redis, 백엔드, 프론트엔드를 모두 실행하려면 최소 `t3.medium` 이상

#### 3단계: 스토리지 설정
- 최소 30GB 이상 (EBS gp3 또는 gp2)
- 프로덕션 환경: 50GB 이상 권장

#### 4단계: 보안 그룹 설정
새 보안 그룹 생성 또는 기존 보안 그룹 사용:

| 유형 | 프로토콜 | 포트 범위 | 소스 | 설명 |
|------|----------|-----------|------|------|
| SSH | TCP | 22 | 내 IP | SSH 접속용 |
| HTTP | TCP | 80 | 0.0.0.0/0 | 웹 트래픽 |
| HTTPS | TCP | 443 | 0.0.0.0/0 | 보안 웹 트래픽 |
| Custom TCP | TCP | 8000 | 0.0.0.0/0 | 백엔드 API (임시) |

**보안 참고**:
- SSH는 본인의 IP만 허용하는 것이 안전
- 프로덕션에서는 8000 포트를 외부에 직접 노출하지 말고 Nginx를 통해서만 접근

#### 5단계: 키 페어 생성
1. "새 키 페어 생성" 선택
2. 키 페어 이름: `koreanforyou-key`
3. 키 페어 유형: RSA
4. 프라이빗 키 파일 형식: `.pem`
5. **중요**: 다운로드한 `.pem` 파일을 안전한 위치에 저장

### 3.2 Elastic IP 할당 (선택사항이지만 권장)

인스턴스를 재시작해도 IP가 변경되지 않도록:

1. EC2 콘솔 → "네트워크 및 보안" → "탄력적 IP"
2. "탄력적 IP 주소 할당" 클릭
3. 할당된 IP를 인스턴스에 연결

**비용**: Elastic IP는 인스턴스에 연결되어 있으면 무료, 미사용 시 요금 부과

### 3.3 EC2 인스턴스 접속

#### macOS/Linux:
```bash
# 키 페어 권한 설정
chmod 400 ~/Downloads/koreanforyou-key.pem

# SSH 접속
ssh -i ~/src/koreanforyou-key.pem ubuntu@3.106.179.223
```

#### Windows (PowerShell):
```powershell
# PuTTY를 사용하거나 Windows 10+ OpenSSH 사용
ssh -i C:\path\to\koreanforyou-key.pem ubuntu@<EC2_PUBLIC_IP>
```

---

## 4. Docker 설치

EC2 인스턴스에 접속한 후:

### 4.1 시스템 업데이트
```bash
sudo apt update && sudo apt upgrade -y
```

### 4.2 Docker 설치
```bash
# 필수 패키지 설치
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Docker GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Docker 리포지토리 추가
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Docker 서비스 시작 및 자동 시작 설정
sudo systemctl start docker
sudo systemctl enable docker

# 현재 사용자를 docker 그룹에 추가 (sudo 없이 docker 명령 사용)
sudo usermod -aG docker $USER

# 변경사항 적용을 위해 재로그인
exit
# 다시 SSH 접속
```

### 4.3 Docker Compose 설치
```bash
# Docker Compose 최신 버전 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 실행 권한 부여
sudo chmod +x /usr/local/bin/docker-compose

# 설치 확인
docker --version
docker-compose --version
```

예상 출력:
```
Docker version 24.0.x, build xxxxx
Docker Compose version v2.x.x
```

---

## 5. 프로젝트 배포

### 5.1 프로젝트 클론

```bash
# Git 설치 (필요 시)
sudo apt install -y git

# 홈 디렉토리로 이동
cd ~

# 프론트엔드 프로젝트 클론
git clone https://github.com/TT-Team-2025/Front_KoreanForYou.git

# 프론트엔드 develop 브랜치로 이동
cd Front_KoreanForYou
git checkout develop
cd ~

# 백엔드 프로젝트 클론 (상위 디렉토리에)
git clone https://github.com/TT-Team-2025/Server_KoreanForYou.git

# 백엔드도 특정 브랜치가 필요하면 (예: develop)
cd Server_KoreanForYou
git checkout develop  # 필요한 경우에만
cd ~
```

디렉토리 구조:
```
/home/ubuntu/
├── Front_KoreanForYou/  (develop 브랜치)
└── Server_KoreanForYou/ (main 또는 develop 브랜치)
```

### 5.2 환경 변수 설정

#### 프로덕션용 docker-compose 파일 생성

```bash
cd ~/Front_KoreanForYou
cp docker-compose.yml docker-compose.prod.yml
nano docker-compose.prod.yml
```

`docker-compose.prod.yml` 수정:

```yaml
services:
  # PostgreSQL
  db:
    image: postgres:16
    container_name: koreanforyou_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: koreanforyou
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d koreanforyou"]
      interval: 5s
      timeout: 3s
      retries: 5

  # Redis
  redis:
    image: redis:7-alpine
    container_name: koreanforyou_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  # FastAPI 백엔드
  backend:
    build:
      context: ../Server_KoreanForYou
      dockerfile: Dockerfile
    container_name: koreanforyou_backend
    restart: unless-stopped
    command: >
      sh -c "pip install --upgrade pip &&
             uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4"
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/koreanforyou
      REDIS_URL: redis://redis:6379/0
      PYTHONUNBUFFERED: 1
      PYTHONPATH: /app
      ENV: production
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      OPENAI_MODEL: ${OPENAI_MODEL}
      OPENAI_BASE_URL: ${OPENAI_BASE_URL}
      RETURN_ZERO_CLIENT_ID: ${RETURN_ZERO_CLIENT_ID}
      RETURN_ZERO_CLIENT_SECRET: ${RETURN_ZERO_CLIENT_SECRET}
      CLOVA_VOICE_CLIENT_ID: ${CLOVA_VOICE_CLIENT_ID}
      CLOVA_VOICE_CLIENT_SECRET: ${CLOVA_VOICE_CLIENT_SECRET}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

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
      # SSL 인증서 볼륨 (나중에 Let's Encrypt 사용 시)
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro

volumes:
  postgres_data:
  redis_data:
```

#### 환경 변수 파일 생성

```bash
nano .env.production
```

내용:
```bash
# Database
POSTGRES_USER=koreanforyou_user
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE
POSTGRES_DB=koreanforyou

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1

# ReturnZero (VITO)
RETURN_ZERO_CLIENT_ID=your_vito_client_id
RETURN_ZERO_CLIENT_SECRET=your_vito_secret

# Clova Voice
CLOVA_VOICE_CLIENT_ID=your_clova_client_id
CLOVA_VOICE_CLIENT_SECRET=your_clova_secret
```

**보안 주의**: 이 파일을 Git에 커밋하지 마세요!

```bash
# .env 파일 권한 설정
chmod 600 .env.production
```

### 5.3 Nginx 설정 수정 (프로덕션용)

```bash
nano nginx.conf
```

백엔드 프록시 주소를 컨테이너 이름으로 수정:
```nginx
location /api/ {
    proxy_pass http://backend:8000;  # 컨테이너 이름으로 변경
    # ... 나머지 설정 동일
}
```

### 5.4 애플리케이션 빌드 및 실행

```bash
# .env 파일 로드 및 Docker Compose 실행
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

명령어 설명:
- `-f docker-compose.prod.yml`: 프로덕션 설정 파일 사용
- `--env-file .env.production`: 환경 변수 파일 지정
- `-d`: 백그라운드 실행 (detached mode)
- `--build`: 이미지를 새로 빌드

### 5.5 배포 확인

```bash
# 컨테이너 상태 확인
docker ps

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f

# 특정 서비스 로그만 보기
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# 백엔드 헬스체크
curl http://localhost:8000/docs

# 프론트엔드 접속 (브라우저에서)
http://<EC2_PUBLIC_IP>
```

---

## 6. 도메인 및 HTTPS 설정

### 6.1 도메인 연결

#### 옵션 A: AWS Route 53 사용
1. Route 53 콘솔 접속
2. 호스팅 영역 생성
3. 도메인 구매 (AWS에서 직접) 또는 기존 도메인의 네임서버 변경
4. A 레코드 생성:
   - 이름: `www` 또는 `@` (루트 도메인)
   - 유형: A
   - 값: EC2 Elastic IP

#### 옵션 B: 외부 DNS 사용 (Cloudflare, GoDaddy 등)
1. DNS 관리 페이지 접속
2. A 레코드 추가:
   - 호스트: `@` 또는 `www`
   - 값: EC2 Public IP
   - TTL: 자동 또는 3600

### 6.2 Let's Encrypt SSL 인증서 설치

#### Certbot 설치
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### SSL 인증서 발급 (Nginx 사용)

먼저 Docker 컨테이너 중지:
```bash
docker-compose -f docker-compose.prod.yml down
```

Nginx를 호스트에 임시 설치:
```bash
sudo apt install -y nginx
```

Certbot으로 인증서 발급:
```bash
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

발급된 인증서 위치:
- 인증서: `/etc/letsencrypt/live/yourdomain.com/fullchain.pem`
- 프라이빗 키: `/etc/letsencrypt/live/yourdomain.com/privkey.pem`

#### Nginx 설정 업데이트 (HTTPS 지원)

`nginx.conf` 수정:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # HTTP를 HTTPS로 리다이렉트
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL 인증서
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /usr/share/nginx/html;
    index index.html;

    # 나머지 설정은 기존과 동일...

    location /api/ {
        proxy_pass http://backend:8000;
        # ... 기존 프록시 설정
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### docker-compose 볼륨 추가

`docker-compose.prod.yml`의 frontend 서비스에 SSL 인증서 볼륨 추가:
```yaml
  frontend:
    # ... 기존 설정
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro  # SSL 인증서 마운트
```

#### 컨테이너 재시작
```bash
# 호스트 Nginx 중지
sudo systemctl stop nginx
sudo systemctl disable nginx

# Docker 컨테이너 재시작
docker-compose -f docker-compose.prod.yml up -d --build
```

#### 인증서 자동 갱신 설정

```bash
# Cron job 추가
sudo crontab -e

# 매월 1일 자동 갱신 (선택: 0 0 1 * *)
0 0 1 * * certbot renew --quiet && docker-compose -f /home/ubuntu/Front_KoreanForYou/docker-compose.prod.yml restart frontend
```

---

## 7. CI/CD 파이프라인 구축

### 7.1 GitHub Actions 설정

프로젝트 루트에 `.github/workflows/deploy.yml` 생성:

```yaml
name: Deploy to AWS EC2

on:
  push:
    branches:
      - main  # main 브랜치에 푸시할 때 배포

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

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
          docker system prune -f
```

### 7.2 GitHub Secrets 설정

1. GitHub 리포지토리 → Settings → Secrets and variables → Actions
2. 다음 Secrets 추가:
   - `EC2_HOST`: EC2 Public IP 또는 도메인
   - `EC2_SSH_KEY`: `.pem` 파일의 전체 내용 (-----BEGIN RSA PRIVATE KEY----- 포함)

### 7.3 배포 테스트

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

GitHub Actions 탭에서 워크플로우 실행 확인

---

## 8. 모니터링 및 로깅

### 8.1 Docker 로그 관리

#### 로그 확인
```bash
# 전체 로그
docker-compose -f docker-compose.prod.yml logs

# 실시간 로그
docker-compose -f docker-compose.prod.yml logs -f

# 특정 서비스 로그
docker logs koreanforyou_backend -f

# 최근 100줄만 보기
docker logs koreanforyou_backend --tail 100
```

#### 로그 로테이션 설정

`docker-compose.prod.yml`에 로깅 설정 추가:
```yaml
services:
  backend:
    # ... 기존 설정
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 8.2 시스템 리소스 모니터링

```bash
# Docker 컨테이너 리소스 사용량
docker stats

# 디스크 사용량
df -h

# 메모리 사용량
free -h

# CPU 사용량
top
```

### 8.3 AWS CloudWatch 연동 (선택사항)

CloudWatch 에이전트 설치:
```bash
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
```

설정 및 시작:
```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json
```

### 8.4 애플리케이션 헬스 체크

간단한 헬스 체크 스크립트 생성:
```bash
nano ~/health_check.sh
```

내용:
```bash
#!/bin/bash

# 백엔드 헬스체크
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/docs)
if [ $BACKEND_STATUS -eq 200 ]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is down (Status: $BACKEND_STATUS)"
    # 필요시 재시작
    # docker-compose -f ~/Front_KoreanForYou/docker-compose.prod.yml restart backend
fi

# 프론트엔드 헬스체크
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ $FRONTEND_STATUS -eq 200 ]; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is down (Status: $FRONTEND_STATUS)"
fi

# 데이터베이스 연결 확인
docker exec koreanforyou_db pg_isready -U koreanforyou_user
if [ $? -eq 0 ]; then
    echo "✅ Database is healthy"
else
    echo "❌ Database is down"
fi
```

실행 권한 부여 및 Cron 등록:
```bash
chmod +x ~/health_check.sh

# 5분마다 실행
crontab -e
# 추가: */5 * * * * /home/ubuntu/health_check.sh >> /home/ubuntu/health_check.log 2>&1
```

---

## 9. 트러블슈팅

### 9.1 일반적인 문제

#### 문제: 컨테이너가 계속 재시작됨
```bash
# 로그 확인
docker logs koreanforyou_backend

# 가능한 원인:
# 1. 환경 변수 누락
# 2. 데이터베이스 연결 실패
# 3. 포트 충돌
```

**해결책**:
```bash
# 환경 변수 확인
docker exec koreanforyou_backend env

# 데이터베이스 연결 테스트
docker exec -it koreanforyou_backend sh
# 컨테이너 내부에서:
# psql -h db -U koreanforyou_user -d koreanforyou

# 포트 사용 확인
sudo netstat -tulpn | grep LISTEN
```

#### 문제: 502 Bad Gateway (Nginx)
**원인**: 백엔드 컨테이너가 준비되지 않음

**해결책**:
```bash
# 백엔드 상태 확인
docker ps | grep backend

# 백엔드 로그 확인
docker logs koreanforyou_backend -f

# 백엔드 재시작
docker-compose -f docker-compose.prod.yml restart backend
```

#### 문제: 데이터베이스 연결 오류
```bash
# PostgreSQL 컨테이너 상태 확인
docker exec koreanforyou_db pg_isready -U koreanforyou_user

# PostgreSQL 로그 확인
docker logs koreanforyou_db

# 데이터베이스 재시작
docker-compose -f docker-compose.prod.yml restart db
```

### 9.2 디스크 공간 부족

```bash
# Docker 리소스 정리
docker system prune -a -f

# 사용하지 않는 볼륨 삭제
docker volume prune -f

# 사용하지 않는 이미지 삭제
docker image prune -a -f

# 로그 파일 정리
sudo journalctl --vacuum-time=7d
```

### 9.3 메모리 부족

```bash
# 메모리 사용량 확인
free -h
docker stats --no-stream

# Swap 메모리 추가 (2GB 예시)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 영구 설정
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 9.4 컨테이너 완전 재시작

```bash
# 모든 컨테이너 중지 및 삭제
docker-compose -f docker-compose.prod.yml down

# 볼륨까지 삭제 (주의: 데이터베이스 데이터도 삭제됨!)
docker-compose -f docker-compose.prod.yml down -v

# 다시 시작
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 배포 체크리스트

배포 전 확인사항:

- [ ] AWS EC2 인스턴스 생성 완료
- [ ] 보안 그룹 설정 (SSH, HTTP, HTTPS)
- [ ] Elastic IP 할당
- [ ] Docker 및 Docker Compose 설치
- [ ] 프로젝트 클론 (Front + Backend)
- [ ] 환경 변수 설정 (`.env.production`)
- [ ] `docker-compose.prod.yml` 설정
- [ ] Docker 컨테이너 빌드 및 실행
- [ ] 애플리케이션 정상 작동 확인
- [ ] 도메인 연결 (선택)
- [ ] SSL 인증서 설치 (선택)
- [ ] CI/CD 파이프라인 설정
- [ ] 모니터링 및 로깅 설정
- [ ] 백업 전략 수립

---

## 유용한 명령어 모음

```bash
# 컨테이너 상태 확인
docker ps -a

# 컨테이너 로그 확인
docker-compose -f docker-compose.prod.yml logs -f [service_name]

# 컨테이너 재시작
docker-compose -f docker-compose.prod.yml restart [service_name]

# 컨테이너 중지
docker-compose -f docker-compose.prod.yml stop

# 컨테이너 시작
docker-compose -f docker-compose.prod.yml start

# 컨테이너 재빌드
docker-compose -f docker-compose.prod.yml up -d --build

# 컨테이너 내부 접속
docker exec -it koreanforyou_backend sh

# 데이터베이스 접속
docker exec -it koreanforyou_db psql -U koreanforyou_user -d koreanforyou

# 시스템 리소스 확인
docker stats

# 디스크 정리
docker system prune -a -f

# 네트워크 확인
docker network ls
docker network inspect [network_name]
```

---

## 비용 예상

### 월간 AWS 비용 (서울 리전 기준)

| 리소스 | 사양 | 월간 비용 (USD) |
|--------|------|-----------------|
| EC2 t3.small | 2 vCPU, 2GB RAM | ~$15 |
| EC2 t3.medium | 2 vCPU, 4GB RAM | ~$30 |
| EC2 t3.large | 2 vCPU, 8GB RAM | ~$60 |
| EBS (gp3) | 30GB | ~$3 |
| EBS (gp3) | 50GB | ~$5 |
| Elastic IP | 1개 (인스턴스 연결 시) | 무료 |
| 데이터 전송 | ~100GB/월 | ~$9 |

**총 예상 비용**:
- 소규모: $27~35/월 (t3.small + 30GB)
- 중규모: $44~52/월 (t3.medium + 50GB)

---

## 추가 리소스

- [AWS EC2 공식 문서](https://docs.aws.amazon.com/ec2/)
- [Docker 공식 문서](https://docs.docker.com/)
- [Docker Compose 가이드](https://docs.docker.com/compose/)
- [Let's Encrypt 가이드](https://letsencrypt.org/getting-started/)
- [Nginx 공식 문서](https://nginx.org/en/docs/)

---

**작성일**: 2025-11-15
**버전**: 1.0
**프로젝트**: KoreanForYou
