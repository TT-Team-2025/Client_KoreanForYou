import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, Calendar, Clock, BookOpen, MessageSquare, Flame, Award, ChevronRight, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Navigation } from "./Navigation";
import { StudyCalendar } from "./StudyCalendar";

interface ProgressScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: (defaultScreen: string) => void;
  onSelectLearningRecord?: (record: any) => void;
}

export function ProgressScreen({ onNavigate, onBack, onSelectLearningRecord }: ProgressScreenProps) {
  const handleBackClick = () => {
    if (onBack) {
      onBack('home');
    } else {
      onNavigate('home');
    }
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
  
  const stats = {
    totalStudyTime: "24시간 15분",
    totalSentences: 156,
    totalConversations: 12,
    currentStreak: 5,
    weeklyGoal: 70,
    weeklyProgress: 65
  };

  const recentActivity = [
    { 
      id: 1,
      date: "2025-10-20", 
      type: "conversation", 
      title: "매장에서 손님응대", 
      score: 88,
      duration: "7분 32초",
      userRole: "서버",
      aiRole: "손님",
      situation: "손님이 메뉴를 주문하는 상황"
    },
    { 
      id: 2,
      date: "2025-10-19", 
      type: "sentence", 
      title: "기본 인사·상태", 
      progress: 100,
      completedSentences: 10,
      totalSentences: 10
    },
    { 
      id: 3,
      date: "2025-10-19", 
      type: "conversation", 
      title: "주방에서 셰프와 대화", 
      score: 92,
      duration: "5분 18초",
      userRole: "주방보조",
      aiRole: "주방장",
      situation: "오늘의 재료 준비 상황 보고"
    },
    { 
      id: 4,
      date: "2025-10-18", 
      type: "sentence", 
      title: "요청·부탁", 
      progress: 80,
      completedSentences: 8,
      totalSentences: 10
    },
    { 
      id: 5,
      date: "2025-10-17", 
      type: "sentence", 
      title: "감사·사과", 
      progress: 100,
      completedSentences: 12,
      totalSentences: 12
    },
    { 
      id: 6,
      date: "2025-10-16", 
      type: "conversation", 
      title: "동료와 협업하기", 
      score: 76,
      duration: "6분 42초",
      userRole: "서빙",
      aiRole: "동료",
      situation: "바쁜 시간대 협력 요청"
    },
    { 
      id: 7,
      date: "2025-10-13", 
      type: "sentence", 
      title: "위치·방향", 
      progress: 60,
      completedSentences: 6,
      totalSentences: 10
    },
    { 
      id: 8,
      date: "2025-10-12", 
      type: "conversation", 
      title: "계산 처리하기", 
      score: 85,
      duration: "4분 15초",
      userRole: "캐셔",
      aiRole: "손님",
      situation: "계산 및 영수증 발급"
    },
    { 
      id: 9,
      date: "2025-10-10", 
      type: "sentence", 
      title: "시간·날짜", 
      progress: 100,
      completedSentences: 8,
      totalSentences: 8
    },
    { 
      id: 10,
      date: "2025-10-09", 
      type: "conversation", 
      title: "불만 대응하기", 
      score: 68,
      duration: "8분 55초",
      userRole: "서빙",
      aiRole: "불만 손님",
      situation: "음식이 늦게 나온 상황"
    },
    { 
      id: 11,
      date: "2025-10-08", 
      type: "sentence", 
      title: "주문받기", 
      progress: 100,
      completedSentences: 15,
      totalSentences: 15
    },
    { 
      id: 12,
      date: "2025-10-07", 
      type: "conversation", 
      title: "재료 주문하기", 
      score: 94,
      duration: "5분 30초",
      userRole: "주방장",
      aiRole: "공급업체",
      situation: "이번 주 필요한 재료 주문"
    },
  ];

  const handleRecordClick = (record: any) => {
    if (onSelectLearningRecord) {
      onSelectLearningRecord(record);
    }
    onNavigate('feedback');
  };

  const chapterProgress = [
    { chapter: "자기소개 하기", level: "초급", progress: 100 },
    { chapter: "인사하기", level: "초급", progress: 100 },
    { chapter: "메뉴 소개하기", level: "초급", progress: 60 },
    { chapter: "주문 받기", level: "중급", progress: 80 },
    { chapter: "계산하기", level: "중급", progress: 60 },
    { chapter: "불만 대응하기", level: "중급", progress: 0 },
  ];

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
                <div className="text-3xl text-blue-900">{stats.totalStudyTime}</div>
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
                <div className="text-3xl text-green-900">{stats.totalSentences}개</div>
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
                <div className="text-3xl text-purple-900">{stats.totalConversations}회</div>
                <div className="text-sm text-purple-700">AI 대화 횟수</div>
              </div>
            </CardContent>
          </Card>

          {/* 연속 학습 */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm">
            <CardContent className="pt-6 pb-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-200/50 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-3xl text-orange-900">{stats.currentStreak}일</div>
                <div className="text-sm text-orange-700">연속 학습</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2️⃣ 중간 섹션 - 이번 주 목표 및 성과 통합 카드 */}
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-amber-600" />
              <CardTitle className="text-amber-900">🎯 이번 주 목표 달성 현황</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* 목표 진행률 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-800">이번 주 목표: {stats.weeklyGoal}분 학습</span>
                <span className="text-amber-900">{stats.weeklyProgress}%</span>
              </div>
              <Progress value={stats.weeklyProgress} className="h-3 bg-amber-100" />
              <div className="text-right text-sm text-amber-700">
                {stats.weeklyGoal - stats.weeklyProgress}분 남음
              </div>
            </div>

            {/* 이번 주 성과 배지 */}
            <div className="pt-2 border-t border-amber-200">
              <p className="text-sm text-amber-800 mb-3">이번 주 성과</p>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-white text-amber-900 border-amber-300 px-4 py-2 shadow-sm">
                  🔥 {stats.currentStreak}일 연속 학습
                </Badge>
                <Badge className="bg-white text-amber-900 border-amber-300 px-4 py-2 shadow-sm">
                  ⭐ 3개 챕터 완료
                </Badge>
                <Badge className="bg-white text-amber-900 border-amber-300 px-4 py-2 shadow-sm">
                  ✅ 주간 목표 달성
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 학습 달력 */}
        <StudyCalendar 
          studiedDates={recentActivity.map(activity => activity.date)}
          currentStreak={stats.currentStreak}
        />

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
                {recentActivity
                  .filter(activity => activity.type === 'sentence')
                  .map((activity) => {
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
                  })}
              </TabsContent>

              <TabsContent value="conversation" className="mt-0 space-y-3">
                {recentActivity
                  .filter(activity => activity.type === 'conversation')
                  .map((activity) => {
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
                  })}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}