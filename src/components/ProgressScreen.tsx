// 학습기록 대시보드 (UI 완성됨, API 연동만 남음) - 2025-11-02 기준

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, Calendar, Clock, BookOpen, MessageSquare, Award, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Navigation } from "./Navigation";
import { StudyCalendar } from "./StudyCalendar";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import { useUserProgress } from "@/hooks/progress/useUserProgress";
import { useSpeechCount } from "@/hooks/scenarios/useSpeechCount";
import { useScenarioHistory } from "@/hooks/scenarios/useScenarioHistory";
import { useRecentChapterFeedbacks } from "@/hooks/chapters/useRecentChapterFeedbacks";

interface ProgressScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: (defaultScreen: string) => void;
  onSelectLearningRecord?: (record: any) => void;
}

export function ProgressScreen({ onNavigate, onBack, onSelectLearningRecord }: ProgressScreenProps) {
  // API로 사용자 정보 조회
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const { data: userProgress, isLoading: isLoadingProgress } = useUserProgress(userProfile?.user_id || 0);
  const { data: userCountSpeech, isLoading: isLoadingSpeechCount } = useSpeechCount();
  const { data: scenarioHistory, isLoading: isLoadingHistory } = useScenarioHistory();
  const { data: chapterFeedbacks } = useRecentChapterFeedbacks(10);

  const handleBackClick = () => {
    if (onBack) {
      onBack('home');
    } else {
      onNavigate('home');
    }
  };

  // 로딩 중일 때
  if (isLoadingProfile || isLoadingProgress) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 학습 시간 포맷팅 (분 -> 시간:분)
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };
  
  // 이번 주인지 확인하는 함수
  const isThisWeek = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // 일요일
    weekStart.setHours(0, 0, 0, 0);
    
    return date >= weekStart;
  };
  
  // AI 대화 기록 데이터 (API에서 가져옴)
  const conversationActivity = scenarioHistory?.data?.map(item => ({
    id: item.progress_id,
    date: item.date,
    type: 'conversation',
    title: item.title,
    score: 85, // TODO: API에 점수 필드 추가 필요
    description: item.description,
    completion_status: item.completion_status,
  })) || [];

  // 문장 학습 기록 (API에서 가져옴)
  const sentenceActivity = chapterFeedbacks?.map(item => ({
    id: item.feedback_id,
    date: item.completed_date,
    type: "sentence",
    title: item.chapter_title,
    progress: item.total_sentences > 0
      ? Math.round((item.completed_sentences / item.total_sentences) * 100)
      : 0,
    completedSentences: item.completed_sentences,
    totalSentences: item.total_sentences,
    score: item.total_score,
    chapter_id: item.chapter_id,
  })) || [];

  const handleRecordClick = (record: any) => {
    if (onSelectLearningRecord) {
      // progress_id를 명시적으로 포함하여 전달
      onSelectLearningRecord({
        ...record,
        progress_id: record.id,
      });
    }
    onNavigate('feedback');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>학습 기록</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6 pb-12">
        {/* 1️⃣ 상단 요약 섹션 - 2x2 카드 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 총 학습 시간 */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
            <CardContent className="pt-6 pb-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-200/50 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl text-blue-900">{formatStudyTime(userProgress?.study_time_minutes || 0)}</div>
                <div className="text-sm text-blue-700">총 학습 시간</div>
              </div>
            </CardContent>
          </Card>

          {/* 완료한 문장 */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
            <CardContent className="pt-6 pb-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-200/50 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl text-green-900">{userProgress?.completed_sentences || 0}개</div>
                <div className="text-sm text-green-700">완료한 문장</div>
              </div>
            </CardContent>
          </Card>

          {/* AI 대화 횟수 */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
            <CardContent className="pt-6 pb-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-200/50 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-3xl text-purple-900">{userCountSpeech?.scenario_count || 0}회</div>
                <div className="text-sm text-purple-700">AI 대화 세션</div>
              </div>
            </CardContent>
          </Card>

          {/* 최근 학습 일자 */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm">
            <CardContent className="pt-6 pb-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-200/50 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-3xl text-orange-900">
                  {userProgress?.last_study_date
                    ? new Date(userProgress.last_study_date).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
                    : '없음'}
                </div>
                <div className="text-sm text-orange-700">최근 학습일</div>
              </div>
            </CardContent>
          </Card>
        </div>

      


        {/* 3️⃣ 하단 탭 영역 - 활동 로그 */}
        <Card className="shadow-md">
          <Tabs defaultValue="sentence" className="w-full">
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="sentence" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  📚 문장 학습
                </TabsTrigger>
                <TabsTrigger value="conversation" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  💬 AI 대화
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="pt-4">
              <TabsContent value="sentence" className="mt-0 space-y-3">
                {sentenceActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">문장 학습 기록이 없습니다.</p>
                  </div>
                ) : (
                  sentenceActivity.map((activity) => {
                    const thisWeek = isThisWeek(activity.date);
                    return (
                      <div 
                        key={activity.id} 
                        className={`flex items-center gap-4 p-4 rounded-xl hover:shadow-md cursor-pointer transition-all ${
                          thisWeek 
                            ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 shadow-sm' 
                            : 'bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100/50 opacity-75'
                        }`}
                        onClick={() => handleRecordClick(activity)}
                      >
                        <div className={`flex items-center justify-center w-14 h-14 rounded-full shadow-sm ${
                          thisWeek ? 'bg-white' : 'bg-white/70'
                        }`}>
                          <BookOpen className={`w-7 h-7 ${thisWeek ? 'text-blue-600' : 'text-blue-500/70'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`truncate ${thisWeek ? 'text-gray-900' : 'text-gray-700'}`}>
                              {activity.title}
                            </span>
                            {thisWeek && (
                              <Badge className="bg-blue-500 text-white text-xs px-2 py-0">이번 주</Badge>
                            )}
                          </div>
                          <div className={`flex items-center gap-3 text-sm ${thisWeek ? 'text-gray-600' : 'text-gray-500'}`}>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {activity.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${thisWeek ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
                              진행률 {activity.progress}%
                            </span>
                          </div>
                        </div>
                        {activity.progress === 100 ? (
                          <Award className={`w-6 h-6 flex-shrink-0 ${thisWeek ? 'text-yellow-500' : 'text-yellow-400/70'}`} />
                        ) : (
                          <ChevronRight className={`w-5 h-5 flex-shrink-0 ${thisWeek ? 'text-gray-400' : 'text-gray-300'}`} />
                        )}
                      </div>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="conversation" className="mt-0 space-y-3">
                {conversationActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">AI 대화 기록이 없습니다.</p>
                  </div>
                ) : (
                  conversationActivity.map((activity) => {
                    const thisWeek = isThisWeek(activity.date);
                    return (
                      <div 
                        key={activity.id} 
                        className={`flex items-center gap-4 p-4 rounded-xl hover:shadow-md cursor-pointer transition-all ${
                          thisWeek 
                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 shadow-sm' 
                            : 'bg-gradient-to-r from-purple-50/60 to-pink-50/60 border border-purple-100/50 opacity-75'
                        }`}
                        onClick={() => handleRecordClick(activity)}
                      >
                        <div className={`flex items-center justify-center w-14 h-14 rounded-full shadow-sm ${
                          thisWeek ? 'bg-white' : 'bg-white/70'
                        }`}>
                          <MessageSquare className={`w-7 h-7 ${thisWeek ? 'text-purple-600' : 'text-purple-500/70'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`truncate ${thisWeek ? 'text-gray-900' : 'text-gray-700'}`}>
                              {activity.title}
                            </span>
                            {thisWeek && (
                              <Badge className="bg-purple-500 text-white text-xs px-2 py-0">이번 주</Badge>
                            )}
                          </div>
                          <div className={`flex items-center gap-3 text-sm ${thisWeek ? 'text-gray-600' : 'text-gray-500'}`}>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {activity.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${activity.score >= 80 ? (thisWeek ? 'bg-green-500' : 'bg-green-400') : (thisWeek ? 'bg-orange-500' : 'bg-orange-400')}`}></div>
                              {activity.score}점
                            </span>
                          </div>
                        </div>
                        {activity.score >= 80 ? (
                          <Award className={`w-6 h-6 flex-shrink-0 ${thisWeek ? 'text-yellow-500' : 'text-yellow-400/70'}`} />
                        ) : (
                          <ChevronRight className={`w-5 h-5 flex-shrink-0 ${thisWeek ? 'text-gray-400' : 'text-gray-300'}`} />
                        )}
                      </div>
                    );
                  })
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}