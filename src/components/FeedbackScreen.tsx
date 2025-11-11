import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  TrendingUp,
  Volume2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import type { FeedbackContextType } from "../types";
import { useSaveScenario } from "@/hooks/scenarios/useSaveScenario";
import { useScenarioFeedback } from "@/hooks/scenarios/useScenarioFeedback";
import { toast } from "sonner";

interface FeedbackScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  learningRecord?: any; // 학습 기록 데이터
  contextType?: FeedbackContextType; // 'scenario' | 'chapter' | 'sentence'
}

export function FeedbackScreen({
  onNavigate,
  learningRecord,
}: FeedbackScreenProps) {
  /** 1) 학습 기록 타입 판별 */
  const recordType = learningRecord?.type || "conversation";
  const isConversation = recordType === "conversation";

  /** 2) progress_id로 피드백 조회 (AI 대화인 경우) */
  const progressId = learningRecord?.progress_id;
  const { data: fetchedFeedbackData, isLoading: isLoadingFeedback } =
    useScenarioFeedback(isConversation ? progressId : undefined);

  /** 3) 시나리오 저장 훅 (모든 hook은 조건문 이전에 호출) */
  const { mutate: saveScenario, isPending: isSaving } = useSaveScenario();

  /** 4) 피드백 데이터 안전 추출 (axios {data:{...}} / 평평한 객체 / 학습기록 내 feedback 모두 대응) */
  const apiFeedback =
    (fetchedFeedbackData as any)?.data ??
    fetchedFeedbackData ??
    learningRecord?.feedback ??
    null;

  const feedback = apiFeedback || {};
  const detailComment = feedback?.detail_comment || {};

  /** 5) threadId(snake/camel 혼용 대응) */
  const threadId =
    learningRecord?.threadId ??
    learningRecord?.thread_id ??
    feedback?.thread_id ??
    null;

  /** 6) 타이틀(scenario_title 백업) */
  const title =
    learningRecord?.title ??
    feedback?.scenario_title ??
    (isConversation
      ? "수고하셨습니다. 대화 결과를 확인하세요"
      : "수고하셨습니다. 학습 결과를 확인하세요");

  /** 7) 로딩 중 */
  if (isConversation && isLoadingFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">피드백을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  /** 8) 소요 시간 포맷터 */
  const formatDuration = (seconds?: number) => {
    if (!seconds && seconds !== 0) return "0분 0초";
    const s = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}분 ${secs}초`;
  };

  /** 9) 세션 데이터 매핑 (빈값 안전) */
  const sessionData = {
    score: Math.round(feedback?.total_score ?? 0),
    duration: formatDuration(feedback?.total_time),
    messageCount: feedback?.turn_count ?? 0,
    pronunciationScore: Math.round(feedback?.pronunciation_score ?? 0),
    fluencyScore: Math.round(feedback?.fluency_score ?? 0),
    accuracyScore: Math.round(feedback?.grammar_score ?? 0),
    strengths: Array.isArray(detailComment?.highlights)
      ? detailComment.highlights
      : [],
    improvements: Array.isArray(detailComment?.improvements)
      ? detailComment.improvements.map((imp: string) => ({
          text: imp,
          severity: "medium" as const,
        }))
      : [],
    keyPhrases: Array.isArray(detailComment?.key_sentence_reviews)
      ? detailComment.key_sentence_reviews.map((review: any) => ({
          text: review?.sentence,
          correct: false,
          feedback: [review?.issue, review?.suggestion]
            .filter(Boolean)
            .join(" - "),
        }))
      : [],
    aiComment:
      feedback?.ai_comment ?? detailComment?.ai_comment ?? "수고하셨습니다!",
  };

  /** 10) 문장 학습 데이터 (샘플/백업) */
  const sentenceData = {
    title: learningRecord?.title || "기본 인사·상태",
    progress: learningRecord?.progress ?? 100,
    completedSentences: learningRecord?.completedSentences ?? 10,
    totalSentences: learningRecord?.totalSentences ?? 10,
    date: learningRecord?.date || "2025-10-14",
    masteredSentences: learningRecord?.masteredSentences ?? [
      { text: "안녕하세요.", translation: "Hello.", mastery: 100 },
      {
        text: "처음 뵙겠습니다.",
        translation: "Nice to meet you.",
        mastery: 100,
      },
      { text: "잘 지내세요?", translation: "How are you?", mastery: 95 },
    ],
    practicedSentences: learningRecord?.practicedSentences ?? [
      {
        text: "오늘도 안녕하세요.",
        translation: "Hello today as well.",
        mastery: 80,
      },
      { text: "괜찮으세요?", translation: "Are you okay?", mastery: 75 },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <main className="max-w-4xl mx-auto p-4 py-8 space-y-6">
        {/* Header Card */}
        <Card
          className={`${
            isConversation
              ? "bg-gradient-to-br from-green-500 to-emerald-500"
              : "bg-gradient-to-br from-blue-500 to-indigo-500"
          } text-white border-0`}
        >
          <CardHeader className="text-center pb-8">
            {isConversation ? (
              <MessageSquare className="w-20 h-20 mx-auto mb-4" />
            ) : (
              <BookOpen className="w-20 h-20 mx-auto mb-4" />
            )}
            <CardTitle className="text-3xl mb-2">
              {isConversation ? "AI 대화 완료!" : "문장 학습 완료!"}
            </CardTitle>
            <CardDescription
              className={isConversation ? "text-green-100" : "text-blue-100"}
            >
              {title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConversation ? (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-4xl mb-1">{sessionData.score}</div>
                  <div className="text-sm text-green-100">총점</div>
                </div>
                <div>
                  <div className="text-4xl mb-1">
                    {sessionData.messageCount}
                  </div>
                  <div className="text-sm text-green-100">대화 횟수</div>
                </div>
                <div>
                  <div className="text-4xl mb-1">{sessionData.duration}</div>
                  <div className="text-sm text-green-100">소요 시간</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-4xl mb-1">{sentenceData.progress}%</div>
                  <div className="text-sm text-blue-100">진행률</div>
                </div>
                <div>
                  <div className="text-4xl mb-1">
                    {sentenceData.completedSentences}
                  </div>
                  <div className="text-sm text-blue-100">완료 문장</div>
                </div>
                <div>
                  <div className="text-4xl mb-1">
                    {sentenceData.totalSentences}
                  </div>
                  <div className="text-sm text-blue-100">총 문장</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI 대화 세부 결과 */}
        {isConversation && (
          <>
            {/* Detailed Scores */}
            <Card>
              <CardHeader>
                <CardTitle>세부 점수</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>발음 정확도</span>
                    <span>{sessionData.pronunciationScore}점</span>
                  </div>
                  <Progress value={sessionData.pronunciationScore} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>유창성</span>
                    <span>{sessionData.fluencyScore}점</span>
                  </div>
                  <Progress value={sessionData.fluencyScore} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>문법 정확성</span>
                    <span>{sessionData.accuracyScore}점</span>
                  </div>
                  <Progress value={sessionData.accuracyScore} />
                </div>
              </CardContent>
            </Card>

            {/* Improvements */}
            {sessionData.improvements.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <CardTitle>개선할 점</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sessionData.improvements.map(
                      (improvement: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
                        >
                          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                          <span>{improvement.text}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Phrases Review */}
            {sessionData.keyPhrases.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>주요 문장 리뷰</CardTitle>
                  <CardDescription>
                    대화 중 개선이 필요한 표현들
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sessionData.keyPhrases.map((phrase: any, i: number) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg border-2 bg-orange-50 border-orange-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                              <span className="font-medium">{phrase.text}</span>
                            </div>
                            {phrase.feedback && (
                              <p className="text-sm text-gray-600 ml-6">
                                {phrase.feedback}
                              </p>
                            )}
                          </div>
                          <Button variant="ghost" size="icon">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Comment */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle>AI 선생님의 코멘트</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">
                  {sessionData.aiComment ||
                    "수고하셨습니다! 계속해서 연습하면 더 나아질 거예요."}
                </p>

                {/* 강점 표시 */}
                {sessionData.strengths.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold text-green-700">잘한 점</h4>
                    {sessionData.strengths.map(
                      (strength: string, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* 문장 학습 세부 결과 */}
        {!isConversation && (
          <>
            {/* Mastered Sentences */}
            {sentenceData.masteredSentences.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <CardTitle>완벽하게 익힌 문장</CardTitle>
                  </div>
                  <CardDescription>
                    {sentenceData.masteredSentences.length}개 문장
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sentenceData.masteredSentences.map((sentence, i) => (
                      <div
                        key={i}
                        className="p-4 bg-green-50 rounded-lg border-2 border-green-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span>{sentence.text}</span>
                            </div>
                            <p className="text-sm text-gray-600 ml-6">
                              {sentence.translation}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-green-500">
                              {sentence.mastery}점
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Practiced Sentences */}
            {sentenceData.practicedSentences.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <CardTitle>연습이 더 필요한 문장</CardTitle>
                  </div>
                  <CardDescription>
                    조금 더 연습하면 완벽해질 거예요!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sentenceData.practicedSentences.map((sentence, i) => (
                      <div
                        key={i}
                        className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                              <span>{sentence.text}</span>
                            </div>
                            <p className="text-sm text-gray-600 ml-6">
                              {sentence.translation}
                            </p>
                            <div className="mt-2 ml-6">
                              <Progress
                                value={sentence.mastery}
                                className="h-2"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-orange-100"
                            >
                              {sentence.mastery}점
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Feedback */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle>AI 선생님의 피드백</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  {sentenceData.masteredSentences.length ===
                  sentenceData.totalSentences
                    ? `완벽합니다! 모든 문장을 훌륭하게 익히셨네요. 이제 실전에서도 자신있게 사용하실 수 있을 거예요!`
                    : sentenceData.masteredSentences.length >
                      sentenceData.totalSentences / 2
                    ? `잘하고 계십니다! ${
                        sentenceData.masteredSentences.length
                      }개 문장을 완벽하게 익히셨어요. ${
                        sentenceData.practicedSentences.length > 0
                          ? "조금만 더 연습하면 모든 문장을 완벽하게 말할 수 있을 거예요!"
                          : ""
                      }`
                    : `좋은 시작입니다! ${sentenceData.completedSentences}개 문장을 연습하셨네요. 꾸준히 반복하면 더 자연스럽게 말할 수 있게 됩니다.`}
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">
                      매일 10분씩 반복해서 연습하세요
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">
                      실제 상황을 상상하며 소리내어 읽어보세요
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">
                      AI 말하기 연습실에서 실전처럼 연습해보세요
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            disabled={isSaving || !isConversation || !threadId}
            onClick={() => {
              if (isConversation && threadId) {
                saveScenario(threadId, {
                  onSuccess: (data: any) => {
                    toast.success("학습 기록이 저장되었습니다!", {
                      description: data?.message || "성공적으로 저장되었어요.",
                    });
                  },
                  onError: (error: any) => {
                    toast.error("저장 실패", {
                      description:
                        error?.message || "학습 기록 저장에 실패했습니다.",
                    });
                  },
                });
              }
            }}
          >
            {isSaving ? "저장 중..." : "저장하기"}
          </Button>

          <Button
            className="flex-1"
            onClick={() => {
              if (isConversation) {
                onNavigate("conversationSetup");
              } else {
                const chapter = learningRecord?.chapter;
                if (chapter) {
                  onNavigate("sentenceLearning", { chapter });
                } else {
                  onNavigate("chapterList");
                }
              }
            }}
          >
            다시 연습하기
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            if (isConversation) {
              onNavigate("home");
            } else {
              onNavigate("chapterList");
            }
          }}
        >
          {isConversation ? "홈으로 돌아가기" : "학습실로 돌아가기"}
        </Button>
      </main>
    </div>
  );
}
