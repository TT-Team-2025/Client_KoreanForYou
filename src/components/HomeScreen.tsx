import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { BookOpen, MessageSquare, Award, Clock, TrendingUp, Volume2 } from "lucide-react";
import { Navigation } from "./Navigation";
import { StudyCalendar } from "./StudyCalendar";
import { LearningRecordCard } from "./shared/LearningRecordCard";
import { StatCard } from "./shared/StatCard";
import { QuickAccessCard } from "./shared/QuickAccessCard";
import { LevelBadge } from "./shared/LevelBadge";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import { useUserStatus } from "@/hooks/users/useUserStatus";
import { useRandomSentence } from "@/hooks/sentences/useRandomSentece";
import { useGetPosts } from "@/hooks/community/usePosts";
import { useSpeechCount } from "@/hooks/scenarios/useSpeechCount";
import { useRecentChapterFeedbacks } from "@/hooks/chapters/useRecentChapterFeedbacks";
import { useScenarioHistory } from "@/hooks/scenarios/useScenarioHistory";
import { useTranslate } from "@/hooks/useTranslate";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onSelectLearningRecord?: (record: any) => void;
}

export function HomeScreen({ onNavigate, onSelectLearningRecord }: HomeScreenProps) {
  // API로 사용자 정보 조회
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const { data : posts , isLoading : isLoadingPosts} = useGetPosts()
  const { data: userStatus, isLoading: isLoadingStatus } = useUserStatus(userProfile?.user_id || 0);
  const { data : userCountSpeech, isLoading: isLodingSpeechCount} = useSpeechCount()

  // 오늘의 문장 조회
  const { data: todaySentence, isLoading: isLoadingSentence } = useRandomSentence();

  // 문장 번역 (translated_content가 null이면 프론트에서 번역)
  const { data: translatedText, isLoading: isTranslating } = useTranslate(
    todaySentence?.content,
    userProfile?.nationality,
    !todaySentence?.translated_content // translated_content가 없을 때만 번역
  );

  // 최근 학습 기록 조회 (API)
  const { data: chapterFeedbacks } = useRecentChapterFeedbacks(3);
  const { data: scenarioHistory } = useScenarioHistory();

  // 로딩 중일 때
  if (isLoadingProfile || isLoadingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 최근 학습 기록 데이터 (API에서 가져옴)
  const sentenceRecords = chapterFeedbacks?.map(item => ({
    id: item.feedback_id,
    type: 'sentence' as const,
    title: item.chapter_title,
    date: item.completed_date,
    progress: item.total_sentences > 0
      ? Math.round((item.completed_sentences / item.total_sentences) * 100)
      : 0,
    completedSentences: item.completed_sentences,
    totalSentences: item.total_sentences,
    score: item.total_score,
    chapter_id: item.chapter_id,
  })) || [];

  const conversationRecords = scenarioHistory?.data?.slice(0, 3).map(item => ({
    id: item.progress_id,
    type: 'conversation' as const,
    title: item.title,
    date: item.date,
    score: 85, // TODO: API에 점수 필드 추가 필요
    description: item.description,
    completion_status: item.completion_status,
  })) || [];

  // 두 배열을 합치고 날짜순으로 정렬
  const recentRecords = [...sentenceRecords, ...conversationRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const handleRecordClick = (record: any) => {
    if (onSelectLearningRecord) {
      onSelectLearningRecord(record);
    }
    onNavigate('feedback');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation onNavigate={onNavigate} currentScreen="home" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">
            안녕하세요, {userProfile?.nickname || '사용자'}님! 👋
          </h1>
          <p className="text-gray-600">오늘도 한국어 학습을 시작해볼까요?</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Access Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <QuickAccessCard
                icon={BookOpen}
                title="문장 학습실"
                description="챕터별 실무 한국어 문장 학습"
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
                borderHoverColor="hover:border-blue-500"
                onClick={() => onNavigate('chapterList')}
              />

              <QuickAccessCard
                icon={MessageSquare}
                title="AI 말하기 연습실"
                description="실제 상황 기반 AI 대화 연습"
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
                borderHoverColor="hover:border-green-500"
                onClick={() => onNavigate('conversationSetup')}
              />
            </div>

            {/* Today's Sentence */}
            <Card className="border-2 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📚</span>
                  오늘의 문장
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSentence ? (
                  <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <p className="text-gray-500">문장을 불러오는 중...</p>
                  </div>
                ) : todaySentence ? (
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <p className="text-2xl text-center mb-3">
                      "{todaySentence.content}"
                    </p>
                    <p className="text-center text-gray-600 mb-4">
                      {isTranslating ? (
                        <span className="text-gray-400">번역 중...</span>
                      ) : (
                        todaySentence.translated_content || translatedText || 'Translation not available'
                      )}
                    </p>
                    <div className="flex justify-center">
                      <Button variant="outline" className="gap-2">
                        <Volume2 className="w-4 h-4" />
                        발음 듣기
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <p className="text-gray-500">문장을 불러올 수 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Learning Records */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>최근 학습 기록</CardTitle>
                  <Button variant="link" onClick={() => onNavigate('progress')}>
                    전체보기 →
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRecords.map((record) => (
                    <LearningRecordCard
                      key={record.id}
                      record={record}
                      onClick={() => handleRecordClick(record)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>커뮤니티 인기글</CardTitle>
                  <Button variant="link" onClick={() => onNavigate('community')}>
                    더보기 →
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingPosts ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">게시글을 불러오는 중...</p>
                  </div>
                ) : posts?.posts && posts.posts.length > 0 ? (
                  <div className="space-y-3">
                    {posts.posts.slice(0, 3).map((post) => (
                      <div key={post.post_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{post.category}</Badge>
                            <span>{post.title}</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">조회 {post.view_count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">게시글이 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Progress */}
          <div className="space-y-6">
      

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={Clock}
                value={`${Math.floor((userStatus?.total_study_time || 0) / 60)}시간`}
                label="학습 시간"
                iconColor="text-blue-500"
              />
              <StatCard
                icon={BookOpen}
                value={`${userStatus?.total_sentences_completed || 0}개`}
                label="완료 문장"
                iconColor="text-green-500"
              />
              <StatCard
                icon={MessageSquare}
                value={`${userCountSpeech?.total_turn_count || 0}회`}
                label="총 발화 수"
                iconColor="text-purple-500"
              />
              <StatCard
                icon={TrendingUp}
                value={`${userStatus?.current_access_days || 0}일`}
                label="연속 학습"
                iconColor="text-orange-500"
              />
            </div>

            {/* Weekly Goal */}
            <Card className="border-2 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg">학습 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>완료한 문장</span>
                    <span>{userStatus?.total_sentences_completed || 0}개</span>
                  </div>
                  <Progress
                    value={Math.min((userStatus?.total_sentences_completed || 0) / 2, 100)}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>AI 대화 세션</span>
                    <span>{userCountSpeech?.scenario_count || 0}회</span>
                  </div>
                  <Progress
                    value={Math.min((userCountSpeech?.scenario_count || 0) * 10, 100)}
                    className="h-2"
                  />
                </div>
                
                {/* 작은 달력 추가 */}
                <div className="pt-3 border-t border-red-200">
                  <StudyCalendar 
                    studiedDates={[
                      "2025-10-12", "2025-10-13", "2025-10-14", "2025-10-16", "2025-10-18", "2025-10-20", "2025-10-21", "2025-10-22"
                    ]}
                    currentStreak={5}
                    compact={true}
                    studyColor="red"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}