import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, Lock, CheckCircle2, BookOpen, Briefcase, Star, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { isChapterUnlocked, getLevelName } from "../types";

interface ChapterListScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: (defaultScreen: string) => void;
  onSelectChapter?: (chapter: any) => void;
  userJob?: string; // 사용자가 선택한 직무 (예: "주방보조", "서빙" 등)
  userLevel?: number; // 사용자 현재 레벨 (1=초급, 2=중급, 3=고급)
}

// 한국어 공통 문장 (모든 사용자 동일 - 직무 무관)
const commonChapters = {
  beginner: [
    { id: 'c1', title: "기본 인사·상태", description: "안녕하세요, 처음 뵙겠습니다", sentences: 10, completed: 10, level_id: 1, type: 'common' },
    { id: 'c2', title: "요청·부탁", description: "도와주세요, 천천히 말해주세요", sentences: 10, completed: 8, level_id: 1, type: 'common' },
    { id: 'c3', title: "확인·동의", description: "맞나요?, 이해하셨어요?", sentences: 8, completed: 5, level_id: 1, type: 'common' },
    { id: 'c4', title: "감사·사과", description: "감사합니다, 죄송합니다", sentences: 10, completed: 3, level_id: 1, type: 'common' },
  ],
  intermediate: [
    { id: 'c5', title: "안내·설명", description: "이렇게 진행하겠습니다", sentences: 12, completed: 3, level_id: 2, type: 'common' },
    { id: 'c6', title: "제안·권유", description: "이 방법은 어떠세요?", sentences: 10, completed: 0, level_id: 2, type: 'common' },
    { id: 'c7', title: "문제상황 대응", description: "문제가 발생했습니다", sentences: 12, completed: 0, level_id: 2, type: 'common' },
    { id: 'c8', title: "일정·합의", description: "시간을 맞춰 보겠습니다", sentences: 10, completed: 0, level_id: 2, type: 'common' },
  ],
  advanced: [
    { id: 'c9', title: "완곡·배려 표현", description: "말씀 이해했습니다만…", sentences: 12, completed: 0, level_id: 3, type: 'common' },
    { id: 'c10', title: "컴플레인 대응", description: "불편을 드려 죄송합니다", sentences: 12, completed: 0, level_id: 3, type: 'common' },
    { id: 'c11', title: "협상·설득", description: "이 조건이면 가능해요", sentences: 12, completed: 0, level_id: 3, type: 'common' },
    { id: 'c12', title: "비상·리스크", description: "안전이 최우선입니다", sentences: 10, completed: 0, level_id: 3, type: 'common' },
  ]
};

// 직무별 문장 데이터 (직무에 따라 다름)
const jobSpecificChapters: Record<string, any> = {
  "kitchen-assistant": { // 주방보조
    beginner: [
      { id: 'j1', title: "조리 도구 이름", description: "칼, 도마, 냄비, 프라이팬", sentences: 10, completed: 7, level_id: 1, type: 'job' },
      { id: 'j2', title: "식재료 이름", description: "야채, 고기, 양념 이름", sentences: 12, completed: 4, level_id: 1, type: 'job' },
      { id: 'j3', title: "기본 조리 동작", description: "자르다, 볶다, 끓이다", sentences: 10, completed: 0, level_id: 1, type: 'job' },
    ],
    intermediate: [
      { id: 'j4', title: "주문 확인하기", description: "주방에서 주문 듣기", sentences: 15, completed: 0, level_id: 2, type: 'job' },
      { id: 'j5', title: "조리 지시 받기", description: "셰프의 지시 이해하기", sentences: 12, completed: 0, level_id: 2, type: 'job' },
      { id: 'j6', title: "위생 관리 표현", description: "청소, 정리, 소독", sentences: 10, completed: 0, level_id: 2, type: 'job' },
    ],
    advanced: [
      { id: 'j7', title: "레시피 이해하기", description: "조리법 듣고 따라하기", sentences: 15, completed: 0, level_id: 3, type: 'job' },
      { id: 'j8', title: "품질 확인하기", description: "신선도, 조리 상태 체크", sentences: 12, completed: 0, level_id: 3, type: 'job' },
      { id: 'j9', title: "팀 협업하기", description: "주방 동료와 소통", sentences: 10, completed: 0, level_id: 3, type: 'job' },
    ]
  },
  "server": { // 서빙
    beginner: [
      { id: 'j1', title: "메뉴 이름 익히기", description: "음식, 음료 이름", sentences: 12, completed: 8, level_id: 1, type: 'job' },
      { id: 'j2', title: "자리 안내하기", description: "손님 맞이 및 안내", sentences: 10, completed: 5, level_id: 1, type: 'job' },
      { id: 'j3', title: "물건 전달하기", description: "물, 수저, 냅킨", sentences: 8, completed: 0, level_id: 1, type: 'job' },
    ],
    intermediate: [
      { id: 'j4', title: "주문 받기", description: "메뉴 주문 듣기", sentences: 15, completed: 0, level_id: 2, type: 'job' },
      { id: 'j5', title: "메뉴 추천하기", description: "인기 메뉴, 오늘의 메뉴", sentences: 12, completed: 0, level_id: 2, type: 'job' },
      { id: 'j6', title: "계산 안내하기", description: "결제 방법, 영수증", sentences: 10, completed: 0, level_id: 2, type: 'job' },
    ],
    advanced: [
      { id: 'j7', title: "불만 처리하기", description: "고객 불만 응대", sentences: 15, completed: 0, level_id: 3, type: 'job' },
      { id: 'j8', title: "예약 관리하기", description: "예약 확인 및 변경", sentences: 12, completed: 0, level_id: 3, type: 'job' },
      { id: 'j9', title: "특별 서비스", description: "기념일, VIP 응대", sentences: 10, completed: 0, level_id: 3, type: 'job' },
    ]
  },
  "barista": { // 바리스타
    beginner: [
      { id: 'j1', title: "음료 이름 익히기", description: "커피, 차, 에이드 이름", sentences: 12, completed: 6, locked: false, type: 'job' },
      { id: 'j2', title: "주문 옵션 듣기", description: "HOT/ICE, 사이즈, 시럽", sentences: 10, completed: 3, locked: false, type: 'job' },
      { id: 'j3', title: "장비 이름", description: "머신, 그라인더, 도구", sentences: 8, completed: 0, locked: false, type: 'job' },
    ],
    intermediate: [
      { id: 'j4', title: "커스터마이징 받기", description: "샷 추가, 우유 변경", sentences: 15, completed: 0, locked: false, type: 'job' },
      { id: 'j5', title: "음료 제조 설명", description: "제조 과정 안내", sentences: 12, completed: 0, locked: false, type: 'job' },
      { id: 'j6', title: "재료 관리 표현", description: "원두, 우유, 시럽 재고", sentences: 10, completed: 0, locked: true, type: 'job' },
    ],
    advanced: [
      { id: 'j7', title: "음료 추천하기", description: "취향별 추천", sentences: 15, completed: 0, locked: true, type: 'job' },
      { id: 'j8', title: "품질 관리하기", description: "맛, 온도, 비주얼 체크", sentences: 12, completed: 0, locked: true, type: 'job' },
      { id: 'j9', title: "이벤트 안내하기", description: "프로모션, 신메뉴", sentences: 10, completed: 0, locked: true, type: 'job' },
    ]
  },
  "cashier": { // 캐셔
    beginner: [
      { id: 'j1', title: "계산 인사하기", description: "결제 시작 인사", sentences: 8, completed: 5, locked: false, type: 'job' },
      { id: 'j2', title: "가격 말하기", description: "숫자, 금액 ��현", sentences: 10, completed: 3, locked: false, type: 'job' },
      { id: 'j3', title: "결제 방법 묻기", description: "카드, 현금, 페이", sentences: 8, completed: 0, locked: false, type: 'job' },
    ],
    intermediate: [
      { id: 'j4', title: "할인 안내하기", description: "쿠폰, 포인트, 이벤트", sentences: 12, completed: 0, locked: false, type: 'job' },
      { id: 'j5', title: "영수증 처리하기", description: "영수증, 현금영수증", sentences: 10, completed: 0, locked: false, type: 'job' },
      { id: 'j6', title: "거스름돈 주기", description: "잔돈, 확인", sentences: 10, completed: 0, locked: true, type: 'job' },
    ],
    advanced: [
      { id: 'j7', title: "결제 문제 해결", description: "카드 오류, 취소", sentences: 15, completed: 0, locked: true, type: 'job' },
      { id: 'j8', title: "환불 처리하기", description: "환불 절차 안내", sentences: 12, completed: 0, locked: true, type: 'job' },
      { id: 'j9', title: "멤버십 안내하기", description: "회원 가입, 혜택", sentences: 10, completed: 0, locked: true, type: 'job' },
    ]
  },
  "delivery": { // 배달
    beginner: [
      { id: 'j1', title: "주소 확인하기", description: "주소, 건물, 호수", sentences: 10, completed: 4, locked: false, type: 'job' },
      { id: 'j2', title: "전화 응대하기", description: "고객 전화 받기", sentences: 8, completed: 2, locked: false, type: 'job' },
      { id: 'j3', title: "도착 알리기", description: "현관, 문 앞 도착", sentences: 8, completed: 0, locked: false, type: 'job' },
    ],
    intermediate: [
      { id: 'j4', title: "길 찾기 표현", description: "위치, 방향 묻기", sentences: 12, completed: 0, locked: false, type: 'job' },
      { id: 'j5', title: "지연 안내하기", description: "늦음, 교통 상황", sentences: 10, completed: 0, locked: false, type: 'job' },
      { id: 'j6', title: "물건 전달하기", description: "음식, 영수증 확인", sentences: 10, completed: 0, locked: true, type: 'job' },
    ],
    advanced: [
      { id: 'j7', title: "문제 상황 대응", description: "분실, 파손 처리", sentences: 15, completed: 0, locked: true, type: 'job' },
      { id: 'j8', title: "안전 운전 표현", description: "날씨, 도로 상황", sentences: 12, completed: 0, locked: true, type: 'job' },
      { id: 'j9', title: "고객 요청 처리", description: "특별 요청 응대", sentences: 10, completed: 0, locked: true, type: 'job' },
    ]
  },
  "chef": { // 주방장
    beginner: [
      { id: 'j1', title: "레시피 용어", description: "계량, 온도, 시간 표현", sentences: 12, completed: 0, locked: false, type: 'job' },
      { id: 'j2', title: "조리법 설명하기", description: "볶다, 끓이다, 굽다", sentences: 10, completed: 0, locked: false, type: 'job' },
      { id: 'j3', title: "주방 지시하기", description: "직원에게 업무 지시", sentences: 10, completed: 0, locked: false, type: 'job' },
    ],
    intermediate: [
      { id: 'j4', title: "식재료 주문하기", description: "발주, 재고 관리", sentences: 15, completed: 0, locked: false, type: 'job' },
      { id: 'j5', title: "메뉴 개발 표현", description: "새 메뉴 기획, 설명", sentences: 12, completed: 0, locked: false, type: 'job' },
      { id: 'j6', title: "품질 관리하기", description: "맛, 신선도 체크", sentences: 10, completed: 0, locked: true, type: 'job' },
    ],
    advanced: [
      { id: 'j7', title: "팀 관리하기", description: "주방 직원 관리", sentences: 15, completed: 0, locked: true, type: 'job' },
      { id: 'j8', title: "위생 점검하기", description: "HACCP, 안전 관리", sentences: 12, completed: 0, locked: true, type: 'job' },
      { id: 'j9', title: "경영진과 소통", description: "보고, 회의, 제안", sentences: 10, completed: 0, locked: true, type: 'job' },
    ]
  },
  "dishwasher": { // 설거지
    beginner: [
      { id: 'j1', title: "주방 도구 이름", description: "접시, 그릇, 컵, 수저", sentences: 10, completed: 0, locked: false, type: 'job' },
      { id: 'j2', title: "세척 용품 이름", description: "세제, 수세미, 행주", sentences: 8, completed: 0, locked: false, type: 'job' },
      { id: 'j3', title: "기본 업무 표현", description: "씻다, 닦다, 정리하다", sentences: 8, completed: 0, locked: false, type: 'job' },
    ],
    intermediate: [
      { id: 'j4', title: "위생 관리하기", description: "소독, 살균, 건조", sentences: 12, completed: 0, locked: false, type: 'job' },
      { id: 'j5', title: "식기 분류하기", description: "종류별 정리, 보관", sentences: 10, completed: 0, locked: false, type: 'job' },
      { id: 'j6', title: "기계 사용하기", description: "���기세척기 조작", sentences: 10, completed: 0, locked: true, type: 'job' },
    ],
    advanced: [
      { id: 'j7', title: "문제 상황 보고", description: "고장, 부족 알리기", sentences: 12, completed: 0, locked: true, type: 'job' },
      { id: 'j8', title: "재고 관리하기", description: "세제, 용품 체크", sentences: 10, completed: 0, locked: true, type: 'job' },
      { id: 'j9', title: "팀워크 표현", description: "동료 협업하기", sentences: 10, completed: 0, locked: true, type: 'job' },
    ]
  }
};

export function ChapterListScreen({ 
  onNavigate, 
  onBack, 
  onSelectChapter, 
  userJob = "kitchen-assistant",
  userLevel = 2 // 기본값: 중급 (실제로는 App.tsx에서 전달)
}: ChapterListScreenProps) {
  const handleBackClick = () => {
    if (onBack) {
      onBack('home');
    } else {
      onNavigate('home');
    }
  };

  // 사용자 직무에 해당하는 직무별 챕터 가져오기
  const jobChapters = jobSpecificChapters[userJob] || jobSpecificChapters["kitchen-assistant"];
  
  // 직무별 챕터에 jobType 추가 (문장 조회용)
  const enrichJobChapters = (chapters: any[]) => {
    return chapters.map(chapter => ({
      ...chapter,
      jobType: userJob
    }));
  };

  // 직무명 한글 매핑
  const jobNames: Record<string, string> = {
    "kitchen-assistant": "주방보조",
    "server": "서빙",
    "barista": "바리스타",
    "cashier": "캐셔",
    "chef": "주방장",
    "dishwasher": "설거지",
    "delivery": "배달"
  };

  // 챕터 잠금 상태 확인
  const checkLocked = (chapter: any) => {
    return !isChapterUnlocked(userLevel, chapter.level_id);
  };

  const handleChapterClick = (chapter: any) => {
    const locked = checkLocked(chapter);
    if (!locked) {
      if (onSelectChapter) {
        onSelectChapter(chapter);
      } else {
        onNavigate('sentenceLearning');
      }
    }
  };

  const ChapterCard = ({ chapter }: { chapter: any }) => {
    const progress = (chapter.completed / chapter.sentences) * 100;
    const locked = checkLocked(chapter);
    const levelName = getLevelName(chapter.level_id);
    
    return (
      <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${locked ? 'opacity-60 bg-gray-50' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle>{chapter.title}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {levelName}
                </Badge>
                {locked && <Lock className="w-4 h-4 text-gray-400" />}
                {!locked && progress === 100 && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </div>
              <CardDescription>{chapter.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">진행률</span>
              <span>{chapter.completed}/{chapter.sentences} 문장</span>
            </div>
            <Progress value={progress} />
            {!locked && (
              <Button 
                className="w-full mt-3" 
                variant={progress === 100 ? "outline" : "default"}
                onClick={() => handleChapterClick(chapter)}
              >
                {progress === 100 ? '복습하기' : progress > 0 ? '이어서 학습' : '시작하기'}
              </Button>
            )}
            {locked && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                <div className="flex items-center gap-2 text-orange-700 mb-1">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">잠긴 챕터</span>
                </div>
                <p className="text-xs text-orange-600">
                  {levelName} 레벨이 필요합니다. 더 많은 학습으로 레벨을 올려보세요!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBackClick}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1>문장 학습실</h1>
              <p className="text-sm text-gray-600">내 직무: {jobNames[userJob]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <Badge variant="secondary" className="text-sm">
              {getLevelName(userLevel)}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {/* 레벨 업 안내 카드 */}
        {userLevel < 3 && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <div className="flex-1">
                  <CardTitle className="text-purple-900">다음 레벨까지</CardTitle>
                  <CardDescription className="text-purple-700">
                    더 많은 챕터를 학습하고 {getLevelName(userLevel + 1)} 레벨로 올라가세요!
                  </CardDescription>
                </div>
                <Badge variant="default" className="bg-purple-600">
                  {getLevelName(userLevel + 1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={65} className="h-2" />
                </div>
                <span className="text-sm text-purple-700">65%</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="intermediate" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="beginner">
              <Badge variant="outline" className="mr-2">초급</Badge>
              Level 1
            </TabsTrigger>
            <TabsTrigger value="intermediate">
              <Badge variant="outline" className="mr-2">중급</Badge>
              Level 2
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Badge variant="outline" className="mr-2">고급</Badge>
              Level 3
            </TabsTrigger>
          </TabsList>

          <TabsContent value="beginner" className="space-y-6">
            {/* 공통 문장 섹션 */}
            <div>
              <div className="flex items-center gap-2 mb-4 px-1">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-blue-600">한국어 기초 표현</h2>
                <Badge variant="secondary">모든 직무 공통</Badge>
              </div>
              <div className="space-y-4">
                {commonChapters.beginner.map((chapter) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            </div>

            {/* 직무별 문장 섹션 */}
            <div>
              <div className="flex items-center gap-2 mb-4 px-1">
                <Briefcase className="w-5 h-5 text-green-600" />
                <h2 className="text-green-600">{jobNames[userJob]} 직무 문장</h2>
                <Badge variant="secondary">맞춤 학습</Badge>
              </div>
              <div className="space-y-4">
                {enrichJobChapters(jobChapters.beginner).map((chapter: any) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="intermediate" className="space-y-6">
            {/* 공통 문장 섹션 */}
            <div>
              <div className="flex items-center gap-2 mb-4 px-1">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-blue-600">한국어 기초 표현</h2>
                <Badge variant="secondary">모든 직무 공통</Badge>
              </div>
              <div className="space-y-4">
                {commonChapters.intermediate.map((chapter) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            </div>

            {/* 직무별 문장 섹션 */}
            <div>
              <div className="flex items-center gap-2 mb-4 px-1">
                <Briefcase className="w-5 h-5 text-green-600" />
                <h2 className="text-green-600">{jobNames[userJob]} 직무 문장</h2>
                <Badge variant="secondary">맞춤 학습</Badge>
              </div>
              <div className="space-y-4">
                {enrichJobChapters(jobChapters.intermediate).map((chapter: any) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            {/* 공통 문장 섹션 */}
            <div>
              <div className="flex items-center gap-2 mb-4 px-1">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-blue-600">한국어 기초 표현</h2>
                <Badge variant="secondary">모든 직무 공통</Badge>
              </div>
              <div className="space-y-4">
                {commonChapters.advanced.map((chapter) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            </div>

            {/* 직무별 문장 섹션 */}
            <div>
              <div className="flex items-center gap-2 mb-4 px-1">
                <Briefcase className="w-5 h-5 text-green-600" />
                <h2 className="text-green-600">{jobNames[userJob]} 직무 문장</h2>
                <Badge variant="secondary">맞춤 학습</Badge>
              </div>
              <div className="space-y-4">
                {enrichJobChapters(jobChapters.advanced).map((chapter: any) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
