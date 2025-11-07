import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Mic, Volume2, CheckCircle, ArrowRight } from "lucide-react";
import api from "../api/axiosInstance";

interface Sentence {
  sentence_id: number;
  content: string;
  text_kr: string;
  text_en: string;
}

interface Feedback {
  pronunciation_score: number;
  fluency_score: number;
  completeness_score: number;
  total_score: number;
  strengths?: string;
  improvements?: string;
}

interface SentenceLearningScreenProps {
  onNavigate: (screen: string) => void;
}

export function SentenceLearningScreen({ onNavigate }: SentenceLearningScreenProps) {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);

  const chapterId = 1; // ✅ 나중에 ChapterListScreen에서 prop으로 받게 변경 예정

  // ✅ 1. 문장 불러오기
  useEffect(() => {
    const fetchSentences = async () => {
      try {
        const res = await api.get(`/chapters/${chapterId}/sentences`);
        setSentences(res.data.sentences);
        console.log("📘 불러온 문장:", res.data.sentences);
      } catch (err) {
        console.error("❌ 문장 불러오기 실패:", err);
      }
    };
    fetchSentences();
  }, []);

  // ✅ 2. TTS 재생
  const handlePlay = async () => {
    const text = sentences[currentIndex]?.content;
    if (!text) return;

    try {
      const res = await api.post(
        "/external/tts",
        {
          text,
          speaker: "nara",
          speed: 0,
          volume: 0,
          pitch: 0,
          emotion: "neutral",
          format: "mp3",
        },
        { responseType: "blob" }
      );

      const audioUrl = URL.createObjectURL(res.data);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error("❌ TTS 실패:", err);
    }
  };

  // ✅ 3. 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
    } catch (err) {
      alert("🎙️ 마이크 접근 권한을 허용해주세요!");
      console.error("❌ 녹음 실패:", err);
    }
  };

  // ✅ 4. 녹음 종료 + STT 전송
  const stopRecording = async () => {
    if (!recorder) return;
    recorder.stop();
    setIsRecording(false);
    recorder.stream.getTracks().forEach((t) => t.stop());

    setTimeout(async () => {
      if (!audioBlob) return;
      const formData = new FormData();
      formData.append("file", audioBlob, "recorded.webm");

      try {
        const res = await api.post("/external/stt/file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const userSpeech = res.data.text;
        console.log("🎧 인식 결과:", userSpeech);
        await sendFeedback(userSpeech);
      } catch (err) {
        console.error("❌ STT 실패:", err);
      }
    }, 500);
  };

  // ✅ 5. 피드백 요청
  const sendFeedback = async (userSpeech: string) => {
    const sentenceId = sentences[currentIndex]?.sentence_id;
    if (!sentenceId) return;

    try {
      const res = await api.post(`/feedback/sentences/${sentenceId}`, {
        user_speech: userSpeech,
      });
      setFeedback(res.data);

      // 진행률 업데이트 + 완료 처리
      await api.patch(`/progress/sentences/${sentenceId}`, { is_completed: true });
      setProgress(((currentIndex + 1) / sentences.length) * 100);
    } catch (err) {
      console.error("❌ 피드백 요청 실패:", err);
    }
  };

  // ✅ 6. 다음 문장
  const handleNextSentence = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedback(null);
    } else {
      alert("🎉 모든 문장을 학습했습니다!");
    }
  };

  const currentSentence = sentences[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 p-6">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          {/* ✅ 상단 헤더 + 돌아가기 버튼 */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <CardTitle>문장 학습실</CardTitle>
              <CardDescription>
                문장을 듣고, 직접 말하며 피드백을 받아보세요.
              </CardDescription>
            </div>

            <Button
              variant="outline"
              className="text-sm"
              onClick={() => onNavigate("chapterList")}
            >
              ← 문장학습실로 돌아가기
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 진행률 */}
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-gray-500 text-right">
            {currentIndex + 1} / {sentences.length} 문장
          </div>

          {/* 현재 문장 */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              {currentSentence?.content || "문장을 불러오는 중..."}
            </h2>
            <p className="text-gray-500">{currentSentence?.text_en}</p>
          </div>

          {/* 버튼 */}
          <div className="flex justify-center gap-4">
            <Button onClick={handlePlay} variant="outline" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> 듣기
            </Button>

            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              >
                <Mic className="w-4 h-4" /> 말하기
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> 녹음 종료
              </Button>
            )}
          </div>

          {/* 피드백 */}
          {feedback && (
            <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
              <h3 className="font-semibold text-lg text-gray-700">AI 피드백</h3>
              <p>발음 점수: {feedback.pronunciation_score}</p>
              <p>유창성 점수: {feedback.fluency_score}</p>
              <p>완성도 점수: {feedback.completeness_score}</p>
              <p className="font-semibold text-red-500">
                총점: {feedback.total_score.toFixed(1)} / 100
              </p>

              {feedback.strengths && (
                <p className="text-green-700">👍 잘한 점: {feedback.strengths}</p>
              )}
              {feedback.improvements && (
                <p className="text-orange-600">🪄 개선할 점: {feedback.improvements}</p>
              )}
            </div>
          )}

          {/* 다음 문장 */}
          <div className="flex justify-end">
            <Button onClick={handleNextSentence} className="flex items-center gap-2">
              다음 문장 <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
