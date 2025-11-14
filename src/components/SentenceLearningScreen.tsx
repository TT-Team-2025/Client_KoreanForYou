import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Mic,
  Volume2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import api from "@/api/axiosInstance";
import { toast } from "sonner";
import { UpdateSentenceProgressResponse } from "@/types/progress";
import { useGenerateChapterFeedback } from "@/hooks/chapters/useGenerateChapterFeedback";

interface Sentence {
  sentence_id: number;
  content: string;
  translated_content?: string;
}

interface SentenceLearningScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  chapter?: {
    chapter_id: number;
    category_id: number;
    level_id: number;
    job_id: number;
    title?: string;
    description?: string;
  };
}

// 🔢 간단한 로컬 채점 함수
// - 원문/인식문을 단어 단위로 나눠서
// - 겹치는 단어 비율을 % 로 환산
const calcMatchScore = (target: string, recognized: string): number => {
  const normalize = (text: string) =>
    text
      .replace(/[^\w가-힣\s]/g, "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

  const targetTokens = normalize(target);
  const recTokens = normalize(recognized);

  if (targetTokens.length === 0) return 0;

  const targetSet = new Set(targetTokens);
  let hit = 0;

  for (const w of recTokens) {
    if (targetSet.has(w)) hit++;
  }

  return Math.round((hit / targetTokens.length) * 100);
};

export function SentenceLearningScreen({ onNavigate, chapter }: SentenceLearningScreenProps) {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 진행 상태
  const [completed, setCompleted] = useState<boolean[]>([]);
  const attemptCountRef = useRef(0); // useState → useRef로 변경 (즉시 반영)
  const [lastScore, setLastScore] = useState<number | null>(null); // 마지막 발화 점수

  // 녹음 관련
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false); // STT/피드백 처리 중
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 챕터 피드백 생성 훅
  const { mutateAsync: generateChapterFeedback } = useGenerateChapterFeedback();

  const currentSentence = sentences[currentIndex];

  const progress =
    completed.length > 0
      ? Math.round((completed.filter(Boolean).length / completed.length) * 100)
      : 0;

  // ===============================
  // 📌 문장 불러오기
  // ===============================
  useEffect(() => {
    const fetchSentences = async () => {
      if (!chapter?.chapter_id) return;

      try {
        const res = await api.get(
          `/chapters/${chapter.chapter_id}/sentences?level_id=${chapter.level_id}`
        );

        const data = res.data?.sentences || res.data || [];
        if (!Array.isArray(data) || data.length === 0) {
          toast.warning("해당 챕터에 문장이 없습니다.");
        }

        setSentences(data);
        setCompleted(new Array(data.length).fill(false));
        setCurrentIndex(0);
        attemptCountRef.current = 0;
      } catch (err) {
        console.error("❌ 문장 불러오기 실패:", err);
        toast.error("문장을 불러올 수 없습니다.");
      }
    };

    fetchSentences();
  }, [chapter]);

  // ===============================
  // 🔊 TTS
  // ===============================
  const handlePlay = async () => {
    if (!currentSentence?.content) {
      toast.warning("문장이 없습니다.");
      return;
    }

    try {
      const res = await api.post(
        "/external/tts",
        { text: currentSentence.content },
        { responseType: "blob" }
      );

      const audioUrl = URL.createObjectURL(res.data);
      new Audio(audioUrl).play();
    } catch (err) {
      console.error("❌ TTS 실패:", err);
      toast.warning("TTS 요청에 실패했습니다. 직접 읽어보세요.");
    }
  };

  // ===============================
  // 🎙 녹음 시작 (mp4 우선)
  // ===============================
  const startRecording = async () => {
    if (!currentSentence) {
      toast.warning("먼저 문장을 불러와 주세요.");
      return;
    }
    if (isEvaluating) {
      toast.info("이전 녹음 처리 중입니다. 잠시만 기다려 주세요.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/webm;codecs=opus";

      console.log("🎤 사용되는 MIME Type:", mimeType);

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
        processRecording(mimeType);
      };

      recorder.start();
      attemptCountRef.current++;
      console.log(`🎤 녹음 시작: attemptCount ${attemptCountRef.current - 1} → ${attemptCountRef.current}`);
      setIsRecording(true);
      toast.info("녹음을 시작합니다. 문장을 읽어 주세요.");
    } catch (err) {
      console.error("🎤 녹음 오류:", err);
      toast.error("마이크 접근 권한을 확인해주세요.");
    }
  };

  // 🎙 녹음 종료
  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  // ===============================
  // 🎧 STT 처리 (Progress API 사용)
  // ===============================
  const processRecording = async (mimeType: string) => {
    try {
      setIsEvaluating(true);

      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(audioChunksRef.current, { type: mimeType });
      const file = new File([blob], `voice.${ext}`, { type: mimeType });

      console.log("📤 STT 전송 파일:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      const formData = new FormData();
      formData.append("file", file);

      toast.info("음성 인식 중입니다...");

      // Progress API 호출 (STT + SentenceProgress 생성)
      const res = await api.patch<UpdateSentenceProgressResponse>(
        `/progress/sentences/${currentSentence.sentence_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setIsEvaluating(false);

      const progressData = res?.data?.data;
      console.log("📄 Progress API 전체 응답:", progressData);

      const sentenceProgressId = progressData?.progress_id;
      const sttText = progressData?.stt_transcript;
      const backendScore = progressData?.overall_score || progressData?.accuracy_score;

      if (!sttText) {
        console.warn("❌ STT 결과 파싱 실패:", progressData);
        toast.warning("음성을 인식하지 못했습니다. 다시 시도해 주세요.");
        return;
      }

      console.log("🎙 인식된 문장:", sttText);
      console.log("📊 Progress ID:", sentenceProgressId);
      console.log("📊 백엔드 점수 정보:", {
        accuracy_score: progressData?.accuracy_score,
        pronunciation_score: progressData?.pronunciation_score,
        overall_score: progressData?.overall_score,
      });
      console.log("📊 단어 분석:", {
        total_word_count: progressData?.total_word_count,
        recognized_word_count: progressData?.recognized_word_count,
        correct_word_count: progressData?.correct_word_count,
        missing_words: progressData?.missing_words,
        extra_words: progressData?.extra_words,
      });

      // 백엔드에 문장 피드백 생성 요청
      if (sentenceProgressId) {
        sendFeedback(sentenceProgressId);
      } else {
        console.warn("⚠ progress_id가 응답에 없습니다.", progressData);
        toast.warning("학습 기록 저장에는 실패했지만, 문장 평가는 진행됩니다.");
      }

      // 백엔드 점수가 있으면 우선 사용, 없으면 로컬 점수 계산
      let finalScore: number;
      if (backendScore !== undefined && backendScore !== null) {
        finalScore = backendScore;
        console.log("✅ 백엔드 점수 사용:", finalScore);
      } else if (currentSentence?.content) {
        finalScore = calcMatchScore(currentSentence.content, sttText);
        console.log("🧮 로컬 채점 점수 사용:", finalScore);
      } else {
        finalScore = 0;
      }

      // 점수 저장 (버튼 활성화/비활성화 판단용)
      setLastScore(finalScore);

      // 상세 피드백 메시지 생성
      let feedbackMessage = `점수: ${Math.round(finalScore)}점`;
      if (progressData?.missing_words?.length > 0) {
        feedbackMessage += `\n누락된 단어: ${progressData.missing_words.join(", ")}`;
      }
      if (progressData?.extra_words?.length > 0) {
        feedbackMessage += `\n추가된 단어: ${progressData.extra_words.join(", ")}`;
      }

      // 간단 안내
      toast.info(`이번 발화 결과`, {
        description: feedbackMessage,
      });

      // 완료 조건 체크 전 상태 로그
      console.log(`🔍 완료 조건 체크: attemptCount=${attemptCountRef.current}, finalScore=${finalScore}`);

      // RULE 1) 첫 발화에서 70점 이상 → 자동 이동
      if (attemptCountRef.current === 1 && finalScore >= 70) {
        console.log(`✅ RULE 1 적용: 첫 발화 70점 이상`);
        markCompleted();
        setTimeout(() => nextSentence(), 700);
        return;
      }

      // RULE 2) 두 번째 발화 이상 → 무조건 이동
      if (attemptCountRef.current >= 2) {
        console.log(`✅ RULE 2 적용: 두 번째 발화 이상`);
        markCompleted();
        setTimeout(() => nextSentence(), 700);
        return;
      }

      // 그 외: 화면에 남겨두고 사용자가 다시 시도
      console.log(`⏸ 다음 시도 대기: 점수가 70점 미만이거나 조건 불일치`);
    } catch (err) {
      console.error("❌ STT 처리 실패:", err);
      setIsEvaluating(false);
      toast.error("녹음 처리 중 오류가 발생했습니다.");
    }
  };

  // ===============================
  // 🧠 문장 피드백 생성 (백엔드 저장용)
  // ===============================
  const sendFeedback = async (sentenceProgressId: number) => {
    const sentenceId = currentSentence?.sentence_id;
    if (!sentenceId) return;

    try {
      // user_id 가져오기 (localStorage에서 또는 JWT 토큰 디코딩)
      let userId: number | null = null;

      // 방법 1: localStorage에서 직접 가져오기
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          userId = user.user_id || user.id;
        } catch (e) {
          console.warn("User 파싱 실패:", e);
        }
      }

      // 방법 2: user_id가 직접 저장되어 있는 경우
      if (!userId) {
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
          userId = parseInt(storedUserId, 10);
        }
      }

      // 방법 3: JWT 토큰에서 추출
      if (!userId) {
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.user_id || payload.sub;
          } catch (e) {
            console.warn("JWT 파싱 실패:", e);
          }
        }
      }

      if (!userId) {
        console.error("❌ user_id를 찾을 수 없습니다");
        toast.warning("사용자 정보를 찾을 수 없어 피드백 저장을 건너뜁니다.");
        return;
      }

      const res = await api.post(`/feedback/sentences/${sentenceId}`, {
        user_id: userId,
        sentence_id: sentenceId,
        sentence_progress_id: sentenceProgressId,
      });
      console.log("✅ 문장 피드백 생성 성공:", res.data);
      // 이 값은 나중에 챕터 피드백/통계에서 사용됨
    } catch (err: any) {
      console.error("🔥 문장 피드백 생성 실패:", err?.response?.data || err);
      // 학습 진행 자체는 계속 가능하므로 토스트는 info 수준으로
      toast.info("문장 피드백 저장에는 실패했지만, 학습은 계속 진행됩니다.");
    }
  };

  // ===============================
  // ✅ 문장 완료 처리 & 다음 문장 이동
  // ===============================
  const markCompleted = () => {
    setCompleted((prev) => {
      const copy = [...prev];
      copy[currentIndex] = true;

      const completedCount = copy.filter(Boolean).length;
      const totalCount = copy.length;
      console.log(`✅ 문장 완료! completed 배열:`, copy);
      console.log(`📊 진행 상황: ${completedCount}/${totalCount} (${Math.round((completedCount/totalCount)*100)}%)`);

      return copy;
    });
  };

  const nextSentence = async () => {
    console.log(`➡️ nextSentence() 호출: currentIndex=${currentIndex}`);
    attemptCountRef.current = 0;
    setLastScore(null); // 점수 초기화

    if (currentIndex < sentences.length - 1) {
      setCurrentIndex((prev) => {
        console.log(`📍 다음 문장으로 이동: ${prev} → ${prev + 1}`);
        return prev + 1;
      });
      return;
    }

    // 마지막 문장일 때 - 현재 문장도 완료되었다고 가정하고 계산
    // (markCompleted()가 setState를 호출하지만 비동기라서 아직 반영 안 됨)
    console.log(`🔍 [nextSentence] 현재 completed state:`, completed);

    const updatedCompleted = [...completed];
    updatedCompleted[currentIndex] = true;
    console.log(`🔍 [nextSentence] 현재 문장(${currentIndex}) 완료 처리 후:`, updatedCompleted);

    const completedCount = updatedCompleted.filter(Boolean).length;
    const totalCount = updatedCompleted.length;

    console.log(`📊 [nextSentence] 완료 현황: ${completedCount}/${totalCount} = ${Math.round((completedCount/totalCount)*100)}%`);

    // 모든 문장 완료 확인
    if (completedCount === totalCount && totalCount > 0) {
      toast.success("이 챕터의 문장을 모두 학습했어요! 🎉");

      if (!chapter?.chapter_id) {
        toast.error("챕터 정보를 찾을 수 없습니다.");
        onNavigate("chapterList");
        return;
      }

      // 챕터 피드백 생성 및 이동
      try {
        toast.loading("피드백을 생성하는 중...", { id: "generate-feedback" });
        const chapterFeedback = await generateChapterFeedback(chapter.chapter_id);
        toast.success("피드백이 생성되었습니다!", { id: "generate-feedback" });

        // 피드백 화면으로 이동
        onNavigate("feedback", {
          type: "sentence",
          title: chapter.title,
          ...chapterFeedback,
        });
      } catch (error) {
        console.error("챕터 피드백 생성 실패:", error);
        toast.error("피드백 생성에 실패했습니다.", { id: "generate-feedback" });
        onNavigate("chapterList");
      }
    } else {
      toast.info(`모든 문장을 학습해야 챕터 피드백을 볼 수 있어요. (${completedCount}/${totalCount})`);
      onNavigate("chapterList");
    }
  };

  const prevSentence = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      attemptCountRef.current = 0;
      setLastScore(null); // 점수 초기화
    } else {
      toast.info("첫 번째 문장입니다.");
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-6">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div>
              <CardTitle>문장 학습실</CardTitle>
              <CardDescription>
                {chapter?.category_id === 0
                  ? "한국어 기초 표현 학습"
                  : "직무별 문장 학습"}
              </CardDescription>
            </div>
            {/* 👉 챕터 목록으로 이동하는 뒤로가기 버튼 */}
            <Button variant="outline" onClick={() => onNavigate("chapterList")}>
              ← 챕터 목록으로
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Progress value={progress} />
          <div className="text-sm text-right text-gray-500">
            {currentIndex + 1}/{sentences.length} 문장
          </div>

          {/* 챕터 제목 */}
          {chapter?.title && (
            <div className="text-center pb-2 border-b border-gray-200">
              <h3 className="text-lg font-bold text-blue-600">
                {chapter.title}
              </h3>
              {chapter.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {chapter.description}
                </p>
              )}
            </div>
          )}

          {/* 문장 영역 */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              {currentSentence?.content || "문장을 불러오는 중..."}
            </h2>
            <p className="text-gray-500">
              {currentSentence?.translated_content}
            </p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={handlePlay}
              disabled={!currentSentence}
            >
              <Volume2 className="w-4 h-4 mr-1" /> 듣기
            </Button>

            {!isRecording ? (
              <Button
                className="bg-blue-500 text-white"
                onClick={startRecording}
                disabled={!currentSentence || isEvaluating}
              >
                <Mic className="w-4 h-4 mr-1" /> 말하기
              </Button>
            ) : (
              <Button
                className="bg-gray-600 text-white"
                onClick={stopRecording}
              >
                <CheckCircle className="w-4 h-4 mr-1" /> 녹음 종료
              </Button>
            )}
          </div>

          {/* 문장 로딩 안내 */}
          {!currentSentence && (
            <div className="flex items-center justify-center text-gray-500 mt-4">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              문장을 불러오는 중입니다...
            </div>
          )}

          {/* 문장 네비게이션 버튼 */}
          <div className="flex justify-between gap-4">
            {/* 이전 문장 버튼 */}
            <Button
              variant="outline"
              onClick={prevSentence}
              disabled={currentIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> 이전 문장
            </Button>

            {/* 다음 문장 버튼 - 조건부 비활성화 */}
            <Button
              onClick={nextSentence}
              disabled={
                attemptCountRef.current === 0 || // 아직 녹음하지 않음
                (attemptCountRef.current === 1 && (lastScore === null || lastScore < 70)) // 첫 발화 70점 미만
              }
              className="flex items-center gap-2"
            >
              다음 문장 <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* 다음 문장 버튼 비활성화 안내 */}
          {attemptCountRef.current === 1 && lastScore !== null && lastScore < 70 && (
            <div className="text-sm text-center text-gray-500 mt-2">
              💡 첫 시도에서 70점 이상을 받거나, 두 번째 시도를 완료하면 다음 문장으로 이동할 수 있습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
