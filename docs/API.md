# 🧭 KoreanForYou API 전체 구조 + 주요 스키마 매핑 (README 버전)

---

## 🔐 1. 인증 (Auth)

| 기능    | Method / Endpoint            | Request Schema       | Request 예시                                               | Response Schema |
| ----- | ---------------------------- | -------------------- | -------------------------------------------------------- | --------------- |
| 회원가입  | **POST** `/api/auth/signup`  | `SignupRequest`      | `{ email, password, nickname, nationality, job, level }` | `TokenResponse` |
| 로그인   | **POST** `/api/auth/login`   | `LoginRequest`       | `{ email, password }`                                    | `TokenResponse` |
| 로그아웃  | **POST** `/api/auth/logout`  | Header Authorization | `axios.post("/api/auth/logout", {}, { headers })`        | `BaseResponse`  |
| 토큰 갱신 | **POST** `/api/auth/refresh` | Header Authorization | `axios.post("/api/auth/refresh", {}, { headers })`       | `TokenResponse` |

### 🧩 관련 스키마

| 스키마명            | 역할                  | 주요 필드                                                    | 관련 기능          |
| --------------- | ------------------- | -------------------------------------------------------- | -------------- |
| `SignupRequest` | 회원가입 요청             | email, password, nickname, nationality, job_id, level_id | `/auth/signup` |
| `LoginRequest`  | 로그인 요청              | email, password                                          | `/auth/login`  |
| `TokenResponse` | 로그인/회원가입 성공 시 토큰 반환 | access_token, refresh_token, token_type                  | `/auth/*`      |
| `BaseResponse`  | 기본 응답 구조            | success, message                                         | `/auth/logout` |

---

## 👤 2. 사용자 (User)

| 기능        | Method / Endpoint                | Request Schema       | 예시                                       | Response Schema      |
| --------- | -------------------------------- | -------------------- | ---------------------------------------- | -------------------- |
| 사용자 조회    | **GET** `/api/users/`            | Header Auth          | -                                        | `UserResponse`       |
| 사용자 수정    | **PUT** `/api/users/`            | `UserUpdate`         | `{ nickname, nationality, profile_img }` | `UserResponse`       |
| 비밀번호 변경   | **PATCH** `/api/users/password`  | `UserPasswordChange` | `{ old_password, new_password }`         | `BaseResponse`       |
| 언어 변경     | **PATCH** `/api/users/language`  | `UserLanguageChange` | `{ language }`                           | `BaseResponse`       |
| 직무 변경     | **PATCH** `/api/users/job`       | `UserJobChange`      | `{ job_id }`                             | `BaseResponse`       |
| 사용자 상태 조회 | **GET** `/api/users/{id}/status` | Path                 | -                                        | `UserStatusResponse` |

### 🧩 관련 스키마

| 스키마명                 | 역할           | 주요 필드                                             | 관련 기능                |
| -------------------- | ------------ | ------------------------------------------------- | -------------------- |
| `UserResponse`       | 사용자 정보 반환    | user_id, email, nickname, job_id, level_id        | `/users`             |
| `UserUpdate`         | 사용자 수정 요청    | nickname, nationality, profile_img                | `/users (PUT)`       |
| `UserPasswordChange` | 비밀번호 변경 요청   | old_password, new_password                        | `/users/password`    |
| `UserLanguageChange` | 모국어 변경 요청    | language                                          | `/users/language`    |
| `UserJobChange`      | 직무 변경 요청     | job_id                                            | `/users/job`         |
| `UserStatusResponse` | 학습 상태(통계) 조회 | total_sentences, completed_sentences, streak_days | `/users/{id}/status` |

---

## 📘 3. 챕터 (Chapters)

| 기능    | Method / Endpoint            | Request Schema  | 예시                               | Response Schema       |
| ----- | ---------------------------- | --------------- | -------------------------------- | --------------------- |
| 챕터 목록 | **GET** `/api/chapters/`     | None            | -                                | `ChapterListResponse` |
| 챕터 생성 | **POST** `/api/chapters/`    | `ChapterCreate` | `{ title, description, job_id }` | `ChapterResponse`     |
| 챕터 수정 | **PUT** `/api/chapters/{id}` | `ChapterUpdate` | `{ title, description }`         | `ChapterResponse`     |

### 🧩 관련 스키마

| 스키마명                  | 역할    | 주요 필드                                          | 관련 기능              |
| --------------------- | ----- | ---------------------------------------------- | ------------------ |
| `ChapterCreate`       | 챕터 생성 | title, description, job_id                     | `/chapters (POST)` |
| `ChapterUpdate`       | 챕터 수정 | title, description                             | `/chapters/{id}`   |
| `ChapterResponse`     | 챕터 상세 | chapter_id, title, description, sentence_count | `/chapters/{id}`   |
| `ChapterListResponse` | 챕터 목록 | chapters: ChapterResponse[]                    | `/chapters/`       |

---

## 💬 4. 문장 (Sentences)

| 기능    | Method / Endpoint                     | Request Schema   | 예시                      | Response Schema             |
| ----- | ------------------------------------- | ---------------- | ----------------------- | --------------------------- |
| 문장 조회 | **GET** `/api/sentences/{id}`         | Path             | -                       | `SentenceResponse`          |
| 문장 수정 | **PUT** `/api/sentences/{id}`         | `SentenceUpdate` | `{ text, translation }` | `SentenceResponse`          |
| 유사 문장 | **GET** `/api/sentences/{id}/similar` | Path             | -                       | `SimilarSentenceResponse[]` |

### 🧩 관련 스키마

| 스키마명                      | 역할    | 주요 필드                          | 관련 기능                     |
| ------------------------- | ----- | ------------------------------ | ------------------------- |
| `SentenceResponse`        | 문장 상세 | sentence_id, text, translation | `/sentences/{id}`         |
| `SentenceUpdate`          | 문장 수정 | text, translation              | `/sentences/{id}`         |
| `SimilarSentenceResponse` | 유사 문장 | sentence_id, similarity_score  | `/sentences/{id}/similar` |

---

## 📈 5. 학습 진행 (Progress)

| 기능         | Method / Endpoint                          | Request Schema           | 예시                       | Response Schema               |
| ---------- | ------------------------------------------ | ------------------------ | ------------------------ | ----------------------------- |
| 사용자 전체 진행  | **GET** `/api/progress/users/{id}`         | Path                     | -                        | `UserProgressResponse`        |
| 문장 진행 업데이트 | **PATCH** `/api/progress/sentences/{id}`   | `SentenceProgressUpdate` | `{ is_completed: true }` | `BaseResponse`                |
| 학습 히스토리    | **GET** `/api/progress/users/{id}/history` | Path                     | -                        | `UserProgressHistoryResponse` |

### 🧩 관련 스키마

| 스키마명                          | 역할          | 주요 필드                           | 관련 기능                          |
| ----------------------------- | ----------- | ------------------------------- | ------------------------------ |
| `UserProgressResponse`        | 전체 학습 진행    | total, completed, progress_rate | `/progress/users/{id}`         |
| `SentenceProgressUpdate`      | 문장 학습 완료 요청 | is_completed, time_spent        | `/progress/sentences/{id}`     |
| `UserProgressHistoryResponse` | 학습 히스토리     | week, completed_count, streak   | `/progress/users/{id}/history` |

---

## 🎭 6. 시나리오 (Scenarios)

| 기능        | Method / Endpoint                               | Request Schema         | 예시                   | Response Schema            |
| --------- | ----------------------------------------------- | ---------------------- | -------------------- | -------------------------- |
| 세션 시작     | **POST** `/api/scenarios/session/start`         | `StartScenarioRequest` | `{ scenario_id: 1 }` | `StartScenarioResponse`    |
| 메시지 전송    | **POST** `/api/scenarios/session/message`       | `SendMessageRequest`   | `{ text: "안녕하세요" }`  | `SendMessageResponse`      |
| 음성 메시지 전송 | **POST** `/api/scenarios/session/message/voice` | multipart file         | (audio)              | `SendVoiceMessageResponse` |

### 🧩 관련 스키마

| 스키마명                       | 역할       | 주요 필드                  | 관련 기능                              |
| -------------------------- | -------- | ---------------------- | ---------------------------------- |
| `StartScenarioRequest`     | 세션 시작 요청 | scenario_id            | `/scenarios/session/start`         |
| `SendMessageRequest`       | 사용자 입력   | text                   | `/scenarios/session/message`       |
| `SendMessageResponse`      | AI 응답    | text, intent, entities | `/scenarios/session/message`       |
| `SendVoiceMessageResponse` | 음성 응답 결과 | transcript, audio_url  | `/scenarios/session/message/voice` |

---

## 🧑‍🤝‍🧑 7. 커뮤니티 (Posts)

| 스키마명                | 역할     | 주요 필드                    | 관련 기능                 |
| ------------------- | ------ | ------------------------ | --------------------- |
| `PostCreate`        | 게시글 생성 | title, content, category | `/posts (POST)`       |
| `PostResponse`      | 게시글 상세 | post_id, author, content | `/posts/{id}`         |
| `ReplyCreate`       | 댓글 작성  | content, post_id         | `/posts/{id}/replies` |
| `ReplyListResponse` | 댓글 목록  | replies: ReplyResponse[] | `/posts/{id}/replies` |

---

## 🔊 8. 외부 서비스 (External)

| 기능      | Endpoint                     | Request Schema | Response                |
| ------- | ---------------------------- | -------------- | ----------------------- |
| TTS 변환  | `/api/external/tts`          | `TTSRequest`   | Base64 audio            |
| STT 인식  | `/api/external/stt/file`     | multipart      | `TranscriptionResponse` |
| LLM 텍스트 | `/api/external/llm/generate` | `LLMRequest`   | `{ generated_text }`    |

### 🧩 관련 스키마

| 스키마명                    | 역할        | 주요 필드               | 관련 기능                    |
| ----------------------- | --------- | ------------------- | ------------------------ |
| `TTSRequest`            | 음성 변환 요청  | text, voice_type    | `/external/tts`          |
| `LLMRequest`            | 텍스트 생성 요청 | prompt, temperature | `/external/llm/generate` |
| `TranscriptionResponse` | STT 결과    | transcribe_id, text | `/external/stt/file`     |

---

## 💬 9. 피드백 (Feedback)

| 스키마명                       | 역할        | 주요 필드                           | 관련 기능                      |
| -------------------------- | --------- | ------------------------------- | -------------------------- |
| `SentenceFeedbackCreate`   | 문장 피드백 생성 | accuracy, fluency, completeness | `/feedback/sentences/{id}` |
| `SentenceFeedbackResponse` | 문장 피드백 결과 | avg_score, comment              | `/feedback/sentences/{id}` |
| `ChapterFeedbackResponse`  | 챕터 피드백    | chapter_id, score               | `/feedback/chapters/{id}`  |
| `ScenarioFeedbackResponse` | 시나리오 피드백  | scenario_id, summary            | `/feedback/scenarios/{id}` |

---

## 📊 10. 통계 (Stats)

| 기능      | Method / Endpoint                            | Request Schema | 예시 | Response Schema         |
| ------- | -------------------------------------------- | -------------- | -- | ----------------------- |
| 유저 통계   | **GET** `/api/stats/users/{user_id}`         | Path           | -  | `ProgressStatsResponse` |
| 챕터 통계   | **GET** `/api/stats/chapters/{chapter_id}`   | Path           | -  | `ProgressStatsResponse` |
| 시나리오 통계 | **GET** `/api/stats/scenarios/{scenario_id}` | Path           | -  | `ProgressStatsResponse` |
| API 사용량 | **GET** `/api/stats/api`                     | None           | -  | `ProgressStatsResponse` |

### 🧩 관련 스키마

| 스키마명                    | 역할        | 주요 필드                                                      | 관련 기능      |
| ----------------------- | --------- | ---------------------------------------------------------- | ---------- |
| `ProgressStatsResponse` | 학습 통계 데이터 | total_hours, total_sentences, weekly_goal, completion_rate | `/stats/*` |

---

## ⚙️ 11. Default

| 기능   | Method / Endpoint | 설명        |
| ---- | ----------------- | --------- |
| 루트   | **GET** `/`       | 서버 루트 반환  |
| 헬스체크 | **GET** `/health` | 서버 상태 확인용 |

---

## ✅ 요약 구조

| 영역        | 주요 데이터 구조                    | 핵심 기능    |
| --------- | ---------------------------- | -------- |
| Auth      | SignupRequest, TokenResponse | 로그인, 토큰  |
| User      | UserResponse, UserUpdate     | 사용자 관리   |
| Chapters  | ChapterResponse              | 학습 챕터    |
| Sentences | SentenceResponse             | 문장 학습    |
| Progress  | UserProgressResponse         | 진행률/히스토리 |
| Scenarios | StartScenarioResponse        | AI 대화 세션 |
| Posts     | PostResponse, ReplyResponse  | 커뮤니티     |
| External  | TTSRequest, LLMRequest       | AI 서비스   |
| Feedback  | SentenceFeedbackResponse     | 피드백      |
| Stats     | ProgressStatsResponse        | 학습 통계    |
