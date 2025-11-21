// ========================================
// 📄 ChapterListScreen.tsx (props 전달형 완성본 + 한 줄 수정 포함)
// ========================================

import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BookOpen, Briefcase, Lock, Home } from "lucide-react";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import { createChaptersByCategory, createChapter } from "@/api/chapter";

interface ChapterListItem {
  chapter_id: number;
  title: string;
  description: string;
  category_id: number;
  level_id: number;
  total_sentences?: number;
  completed_sentences?: number;
  completion_rate?: number; // 0-100 정수
}

interface ChapterListScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

const JOB_NAME_MAP: Record<number, string> = {
  1: "주방보조",
  2: "서빙",
  3: "바리스타",
  4: "캐셔",
  5: "배달",
  6: "주방장",
  7: "설거지",
};

export function ChapterListScreen({ onNavigate }: ChapterListScreenProps) {
  const [chapters, setChapters] = useState<ChapterListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"common" | "job">("common");
  const [showStats, setShowStats] = useState(false);

  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();

  useEffect(() => {
    if (isLoadingProfile || !userProfile?.level_id || userProfile.job_id === undefined || !userProfile.user_id) return;

    const fetchChapters = async () => {
      try {
        // category_id 없이 level_id만 지정하여 해당 레벨의 모든 챕터 조회
        let allChapters: any[] = [];
        
        try {
          // level_id만 지정하여 챕터 조회 (page, size는 기본값 사용)
          const allChaptersRes = await api.get(`/chapters/?level_id=${userProfile.level_id}`);
          console.log("📋 챕터 조회 응답:", allChaptersRes.data);
          allChapters = allChaptersRes.data?.chapters ?? [];
          const total = allChaptersRes.data?.total ?? 0;
          console.log(`📊 초기 조회된 챕터: ${allChapters.length}개 (전체: ${total}개)`);
          
          // 전체 챕터가 더 있으면 추가 페이지 조회
          if (total > allChapters.length) {
            console.log(`📄 전체 ${total}개 중 ${allChapters.length}개만 조회됨. 추가 페이지 조회 중...`);
            const totalPages = Math.ceil(total / 20); // 기본 size=20
            const additionalPromises = [];
            for (let page = 2; page <= totalPages; page++) {
              additionalPromises.push(
                api.get(`/chapters/?level_id=${userProfile.level_id}&page=${page}`)
                  .then(res => res.data?.chapters ?? [])
                  .catch(() => [])
              );
            }
            const additionalChapters = await Promise.all(additionalPromises);
            const flatAdditional = additionalChapters.flat();
            allChapters.push(...flatAdditional);
            console.log(`✅ 추가 조회 완료: 총 ${allChapters.length}개`);
          }
        } catch (fetchError: any) {
          console.error("⚠️ 초기 챕터 조회 실패:", fetchError);
          console.error("에러 상세:", fetchError?.response?.data);
          // 조회 실패 시 빈 배열로 시작
          allChapters = [];
        }

        // 챕터가 0개면 자동으로 생성
        if (allChapters.length === 0 && userProfile.job_id !== undefined) {
          console.log("🔵 챕터가 없습니다. 자동 생성을 시작합니다...");
          try {
            const createResult = await createChaptersByCategory(userProfile.job_id);
            console.log("📋 카테고리 생성 응답:", createResult);
            
            // 성공적으로 생성되었거나, 이미 존재하는 경우 모두 성공으로 처리
            if (createResult.success || createResult.message?.includes("이미") || createResult.message?.includes("존재")) {
              console.log("✅ 카테고리 생성 완료!");
              
              // 생성된 카테고리 정보 확인
              const createdCategories = createResult.data || [];
              console.log(`📋 생성된 카테고리: ${createdCategories.length}개`);
              
              // 직무별 챕터 생성 (category_id = job_id로 사용)
              if (userProfile.level_id && userProfile.job_id !== undefined) {
                console.log(`🔵 직무별 챕터 생성 시작 (job_id=${userProfile.job_id}, category_id=${userProfile.job_id})...`);
                
                // 타입 안전성 체크
                const levelId = userProfile.level_id;
                const jobId = userProfile.job_id;
                
                // 생성된 카테고리 내용을 사용하여 챕터 생성 (category_id는 job_id 사용)
                const batchSize = 5; // 한 번에 5개씩 처리
                for (let i = 0; i < createdCategories.length; i += batchSize) {
                  const batch = createdCategories.slice(i, i + batchSize);
                  const batchPromises = batch.map(async (category: any) => {
                    try {
                      const chapterData = {
                        category_id: jobId, // category_id = job_id로 사용
                        job_id: jobId,
                        level_id: levelId,
                        title: category.content,
                        description: `${category.content}에 대한 학습 챕터`,
                        is_active: true
                      };
                      
                      await createChapter(chapterData);
                      console.log(`✅ 직무 챕터 생성 완료: ${category.content}`);
                      return true;
                    } catch (error: any) {
                      if (error?.response?.status === 400 || error?.message?.includes("duplicate")) {
                        console.log(`ℹ️ 직무 챕터는 이미 존재합니다: ${category.content}`);
                        return true;
                      } else {
                        console.error(`⚠️ 직무 챕터 생성 실패:`, error?.message);
                        return false;
                      }
                    }
                  });
                  
                  await Promise.all(batchPromises);
                  
                  // 배치 간 짧은 딜레이
                  if (i + batchSize < createdCategories.length) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                  }
                }
                
                console.log("✅ 모든 직무 챕터 생성 완료!");
              }
              
              // 공통 챕터도 생성 (category_id=0)
              if (userProfile.level_id) {
                try {
                  console.log("🔵 공통 챕터 생성 시작...");
                  const commonChapterData = {
                    category_id: 0,
                    job_id: 0,
                    level_id: userProfile.level_id,
                    title: "한국어 기초 표현",
                    description: "일상 생활에서 자주 사용하는 기본 한국어 표현을 학습합니다",
                    is_active: true
                  };
                  await createChapter(commonChapterData);
                  console.log("✅ 공통 챕터 생성 완료");
                } catch (error: any) {
                  if (error?.response?.status === 400 || error?.message?.includes("duplicate")) {
                    console.log("ℹ️ 공통 챕터는 이미 존재합니다.");
                  } else {
                    console.warn("⚠️ 공통 챕터 생성 실패:", error?.message);
                  }
                }
              }
              
              // 챕터 생성 후 DB 반영 시간 확보
              console.log("⏳ 챕터 생성 완료, DB 반영 대기 중...");
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // 챕터 목록 불러오기 (생성 후 반드시 조회)
              let fetchedChapters: any[] = [];
              try {
                console.log(`🔍 전체 챕터 조회 중 (level_id=${userProfile.level_id})...`);
                
                // 첫 페이지 조회
                const allChaptersRes = await api.get(`/chapters/?level_id=${userProfile.level_id}`);
                console.log("📋 챕터 조회 응답:", allChaptersRes.data);
                fetchedChapters = allChaptersRes?.data?.chapters ?? [];
                const total = allChaptersRes?.data?.total ?? 0;
                
                console.log(`📊 조회된 챕터: ${fetchedChapters.length}개 (전체: ${total}개)`);
                
                // 전체 챕터가 더 있으면 추가 페이지 조회
                if (total > fetchedChapters.length) {
                  console.log(`📄 전체 ${total}개 중 ${fetchedChapters.length}개만 조회됨. 추가 페이지 조회 중...`);
                  const totalPages = Math.ceil(total / 20); // 기본 size=20
                  const additionalPromises = [];
                  for (let page = 2; page <= totalPages; page++) {
                    additionalPromises.push(
                      api.get(`/chapters/?level_id=${userProfile.level_id}&page=${page}`)
                        .then(res => res.data?.chapters ?? [])
                        .catch(() => [])
                    );
                  }
                  const additionalChapters = await Promise.all(additionalPromises);
                  const flatAdditional = additionalChapters.flat();
                  fetchedChapters.push(...flatAdditional);
                  console.log(`✅ 추가 조회 완료: 총 ${fetchedChapters.length}개`);
                }
                
                if (fetchedChapters.length === 0) {
                  // 재시도
                  console.log("⏳ 챕터가 아직 조회되지 않습니다. 재시도 중...");
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  
                  const retryRes = await api.get(`/chapters/?level_id=${userProfile.level_id}`);
                  fetchedChapters = retryRes?.data?.chapters ?? [];
                  const retryTotal = retryRes?.data?.total ?? 0;
                  
                  if (retryTotal > fetchedChapters.length) {
                    const retryTotalPages = Math.ceil(retryTotal / 20);
                    const retryPromises = [];
                    for (let page = 2; page <= retryTotalPages; page++) {
                      retryPromises.push(
                        api.get(`/chapters/?level_id=${userProfile.level_id}&page=${page}`)
                          .then(res => res.data?.chapters ?? [])
                          .catch(() => [])
                      );
                    }
                    const retryAdditional = await Promise.all(retryPromises);
                    fetchedChapters.push(...retryAdditional.flat());
                  }
                  
                  if (fetchedChapters.length > 0) {
                    console.log(`✅ 재시도 후 챕터 목록 불러오기 완료! (${fetchedChapters.length}개)`);
                  } else {
                    console.warn("⚠️ 챕터가 생성되지 않았습니다.");
                  }
                } else {
                  console.log("✅ 챕터 목록 불러오기 완료!");
                }
              } catch (fetchError: any) {
                console.error("⚠️ 챕터 목록 조회 중 에러:", fetchError);
                console.error("에러 상세:", fetchError?.response?.data);
              }
              
              // 조회된 챕터를 allChapters에 할당 (push가 아닌 할당)
              if (fetchedChapters.length > 0) {
                allChapters = fetchedChapters;
              }
            } else {
              console.log("ℹ️ 카테고리 생성 결과:", createResult.message);
            }
          } catch (createError: any) {
            // 500 에러나 중복 키 에러는 이미 존재하는 것으로 간주하고 계속 진행
            if (createError?.response?.status === 500 || 
                createError?.message?.includes("duplicate") ||
                createError?.message?.includes("already exists")) {
              console.log("ℹ️ 카테고리가 이미 존재합니다. 챕터 목록을 다시 불러옵니다...");
              
              // 챕터 목록 다시 불러오기
              try {
                const allChaptersRes = await api.get(`/chapters/?level_id=${userProfile.level_id}`);
                let fetchedChapters = allChaptersRes?.data?.chapters ?? [];
                const total = allChaptersRes?.data?.total ?? 0;
                
                // 전체 챕터가 더 있으면 추가 페이지 조회
                if (total > fetchedChapters.length) {
                  const totalPages = Math.ceil(total / 20);
                  const additionalPromises = [];
                  for (let page = 2; page <= totalPages; page++) {
                    additionalPromises.push(
                      api.get(`/chapters/?level_id=${userProfile.level_id}&page=${page}`)
                        .then(res => res.data?.chapters ?? [])
                        .catch(() => [])
                    );
                  }
                  const additionalChapters = await Promise.all(additionalPromises);
                  fetchedChapters.push(...additionalChapters.flat());
                }
                
                console.log(`📊 조회된 챕터: ${fetchedChapters.length}개 (전체: ${total}개)`);
                allChapters = fetchedChapters;
              } catch (retryError) {
                console.error("⚠️ 챕터 목록 재조회 실패:", retryError);
              }
            } else {
              console.error("⚠️ 카테고리 생성 실패:", createError);
            }
          }
        }

        // 각 챕터의 완료율 조회
        const chaptersWithProgress = await Promise.all(
          allChapters.map(async (ch: any) => {
            try {
              const progressRes = await api.get(
                `/progress/users/${userProfile.user_id}/chapters/${ch.chapter_id}`
              );
              const completion_rate = progressRes.data?.data?.completion_rate ?? 0;

              return {
                ...ch,
                completion_rate,
                category_name:
                  ch.category_id === 0
                    ? "한국어 기초 표현"
                    : `${JOB_NAME_MAP[ch.category_id] || "기타"} 직무 문장`,
              };
            } catch (err) {
              // 진행률 조회 실패 시 0으로 설정
              console.warn(`챕터 ${ch.chapter_id} 진행률 조회 실패:`, err);
              return {
                ...ch,
                completion_rate: 0,
                category_name:
                  ch.category_id === 0
                    ? "한국어 기초 표현"
                    : `${JOB_NAME_MAP[ch.category_id] || "기타"} 직무 문장`,
              };
            }
          })
        );

        setChapters(chaptersWithProgress);
      } catch (err: any) {
        console.error("❌ 챕터 불러오기 실패:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [userProfile, isLoadingProfile]);

  const commonChapters = chapters.filter((ch) => ch.category_id === 0);
  const jobChapters = chapters.filter((ch) => ch.category_id !== 0);

  const visibleChapters = activeTab === "common" ? commonChapters : jobChapters;

  // 통계 계산
  const calculateStats = (chapterList: ChapterListItem[]) => {
    const total = chapterList.length;
    const completed = chapterList.filter((ch) => ch.completion_rate === 100).length;
    const inProgress = chapterList.filter((ch) => (ch.completion_rate ?? 0) > 0 && ch.completion_rate !== 100).length;
    const notStarted = total - completed - inProgress;
    const averageProgress = total > 0
      ? Math.round(chapterList.reduce((sum, ch) => sum + (ch.completion_rate ?? 0), 0) / total)
      : 0;

    return { total, completed, inProgress, notStarted, averageProgress };
  };

  const stats = calculateStats(visibleChapters);

  if (loading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        📚 챕터를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      {/* 헤더 */}
      <header className="max-w-4xl mx-auto flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("home")}
              className="flex-shrink-0"
            >
              <Home className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">문장 학습실</h1>
              <p className="text-gray-500 text-sm">
                내 직무: {JOB_NAME_MAP[userProfile?.job_id || 0] || "미지정"} / Level{" "}
                {userProfile?.level_id}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2"
          >
            {showStats ? "통계 숨기기" : "진행률 통계"}
          </Button>
        </div>
      </header>

      {/* 통계 섹션 */}
      {showStats && (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-lg">
                {activeTab === "common" ? "한국어 기초 표현" : `${JOB_NAME_MAP[userProfile?.job_id || 0]} 직무 문장`} 학습 진행률
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 원형 진행률 표시 */}
              <div className="flex items-center justify-center py-4">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    {/* 배경 원 */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    {/* 진행률 원 */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={stats.averageProgress === 100 ? "#10b981" : "#3b82f6"}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - stats.averageProgress / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">{stats.averageProgress}%</span>
                    <span className="text-sm text-gray-600">평균 진행률</span>
                  </div>
                </div>
              </div>

              {/* 통계 카드 */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-gray-700">{stats.total}</div>
                  <div className="text-xs text-gray-500 mt-1">전체</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-xs text-green-600 mt-1">완료</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                  <div className="text-xs text-blue-600 mt-1">진행 중</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
                  <div className="text-xs text-gray-500 mt-1">미시작</div>
                </div>
              </div>

              {/* 진행률 막대 그래프 */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700">챕터별 진행률</div>
                {visibleChapters.slice(0, 5).map((ch) => (
                  <div key={ch.chapter_id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 truncate max-w-[200px]">{ch.title}</span>
                      <span className="font-semibold text-gray-700">{ch.completion_rate ?? 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          (ch.completion_rate ?? 0) === 100
                            ? "bg-green-500"
                            : (ch.completion_rate ?? 0) >= 50
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }`}
                        style={{ width: `${ch.completion_rate ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
                {visibleChapters.length > 5 && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    ...외 {visibleChapters.length - 5}개 챕터
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 탭 */}
      <div className="max-w-4xl mx-auto flex gap-2 border-b border-gray-200">
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg ${
            activeTab === "common"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("common")}
        >
          <BookOpen className="w-4 h-4" />
          한국어 기초 표현
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg ${
            activeTab === "job"
              ? "text-green-600 border-b-2 border-green-600 bg-green-50"
              : "text-gray-500 hover:text-green-500"
          }`}
          onClick={() => setActiveTab("job")}
        >
          <Briefcase className="w-4 h-4" />
          {JOB_NAME_MAP[userProfile?.job_id || 0] || "직무"} 직무 문장
        </button>
      </div>

      {/* 챕터 리스트 */}
      <main className="max-w-4xl mx-auto space-y-6 mt-2">
        {visibleChapters.length === 0 ? (
          <div className="text-center text-gray-500 py-10">😢 불러올 챕터가 없습니다.</div>
        ) : (
          visibleChapters.map((ch) => {
            const progress = ch.completion_rate ?? 0;

            const isLocked = ch.level_id > (userProfile?.level_id ?? 1);

            return (
              <Card
                key={ch.chapter_id}
                className={`transition border-gray-200 bg-white ${
                  isLocked ? "opacity-60 pointer-events-none" : "hover:shadow-md"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 text-base font-semibold">
                      {ch.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-gray-600">
                      Level {ch.level_id}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{ch.description}</p>
                </CardHeader>

                <CardContent className="flex items-center justify-between pt-2">
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">학습 진행률</span>
                      <span className={`text-lg font-bold ${
                        progress === 100 ? 'text-green-600' :
                        progress >= 50 ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    {progress === 100 && (
                      <span className="text-xs text-green-600 font-medium mt-1">
                        ✓ 완료
                      </span>
                    )}
                    {progress > 0 && progress < 100 && (
                      <span className="text-xs text-blue-600 font-medium mt-1">
                        진행 중
                      </span>
                    )}
                  </div>

                  {isLocked ? (
                    <div className="ml-4 text-gray-400 flex items-center gap-1">
                      <Lock className="w-4 h-4" /> 잠김
                    </div>
                  ) : (
                    // ⭐⭐⭐⭐⭐ 여기가 "한 줄 수정" 포함된 최종본
                    <Button
                      onClick={() =>
                        onNavigate("sentenceLearning", {
                          chapter: {
                            chapter_id: ch.chapter_id,
                            category_id: ch.category_id,
                            level_id: ch.level_id,
                            job_id: userProfile?.job_id,
                            title: ch.title,
                            description: ch.description,
                          },
                        })
                      }
                      className={`ml-4 px-4 ${
                        activeTab === "common"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white`}
                    >
                      {progress > 0 ? "이어하기" : "시작하기"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </main>
    </div>
  );
}
