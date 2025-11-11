// ========================================
// 📄 ChapterListScreen.tsx (2025-11-07 수정: 홈으로 돌아가기 버튼 추가)
// ========================================

import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BookOpen, Briefcase } from "lucide-react";
import { useUserProfile } from "@/hooks/users/useUserProfile";

// 서버에서 반환하는 챕터 목록의 실제 구조
interface ChapterListItem {
  chapter_id: number;
  title: string;
  description: string;
  category_name: string;
  level_name: string;
  job_name?: string;
  total_sentences: number;
  completed_sentences: number;
}

interface ChapterListScreenProps {
  onNavigate: (screen: string, chapterId?: number) => void;
}

export function ChapterListScreen({ onNavigate }: ChapterListScreenProps) {
  const [chapters, setChapters] = useState<ChapterListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ 사용자 프로필 정보 가져오기
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();

  // ✅ 챕터 데이터 불러오기
  useEffect(() => {
    // 사용자 프로필이 로딩 중이면 대기
    if (isLoadingProfile || !userProfile) {
      return;
    }

    const fetchChapters = async () => {
      try {
        const res = await api.get(`/chapters/`, {
          params: {
            category_id: 1, // 기본값 유지 (필요시 추가 정보 필요)
            level_id: userProfile.level_id || 1,
          },
        });
        console.log("📦 서버 응답:", res.data);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.chapters || [];

        setChapters(data);
      } catch (err) {
        console.error("❌ 챕터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [userProfile, isLoadingProfile]);

  // ✅ reduce 전에 배열 확인
  const grouped = Array.isArray(chapters)
    ? chapters.reduce((acc: Record<string, ChapterListItem[]>, ch: ChapterListItem) => {
        const key = ch.category_name || "기타";
        if (!acc[key]) acc[key] = [];
        acc[key].push(ch);
        return acc;
      }, {})
    : {};

  if (loading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        📚 챕터를 불러오는 중입니다...
      </div>
    );
  }

  if (!Array.isArray(chapters) || chapters.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        😢 불러올 챕터가 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-red-50 p-6 space-y-8">
      {/* ✅ 상단 헤더 */}
      <header className="max-w-4xl mx-auto flex items-center justify-between">
        {/* 왼쪽: 제목 */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">문장 학습실</h1>
          <p className="text-gray-500 text-sm">
            직무와 레벨에 맞는 문장을 학습하세요.
          </p>
        </div>

        {/* 오른쪽: 홈으로 돌아가기 버튼 */}
        <Button
          variant="outline"
          className="text-sm"
          onClick={() => onNavigate("home")}
        >
          ← 홈으로 돌아가기
        </Button>
      </header>

      {/* ✅ 그룹별 챕터 목록 */}
      <main className="max-w-4xl mx-auto space-y-10 mt-4">
        {Object.entries(grouped).map(([category, list]) => (
          <section key={category} className="space-y-4">
            {/* 카테고리 제목 */}
            <div className="flex items-center gap-2">
              {category.includes("직무") ? (
                <Briefcase className="w-5 h-5 text-green-600" />
              ) : (
                <BookOpen className="w-5 h-5 text-blue-600" />
              )}
              <h2
                className={`text-lg sm:text-xl font-semibold ${
                  category.includes("직무") ? "text-green-700" : "text-blue-700"
                }`}
              >
                {category}
              </h2>
              <Badge variant="outline" className="ml-1 text-xs">
                {list[0]?.level_name || "레벨 미정"}
              </Badge>
            </div>

            {/* 챕터 카드 목록 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {list.map((ch) => {
                const progress =
                  ch.total_sentences > 0
                    ? Math.round(
                        (ch.completed_sentences / ch.total_sentences) * 100
                      )
                    : 0;

                return (
                  <Card
                    key={ch.chapter_id}
                    className="hover:shadow-md transition border-gray-200 bg-white"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-gray-800 text-base font-semibold">
                          {ch.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-gray-600">
                          {ch.level_name}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {ch.description}
                      </p>
                    </CardHeader>

                    <CardContent className="flex items-center justify-between pt-2">
                      <div className="flex flex-col w-full">
                        <span className="text-xs text-gray-500 mb-1">
                          진행률 {progress}%
                        </span>
                        <Progress value={progress} className="h-2" />
                        <span className="text-xs text-gray-400 mt-1">
                          {ch.completed_sentences}/{ch.total_sentences} 문장
                        </span>
                      </div>

                      <Button
                        onClick={() =>
                          onNavigate("sentenceLearning", ch.chapter_id)
                        }
                        className={`ml-4 px-4 ${
                          progress > 0
                            ? "bg-gray-700 hover:bg-gray-800"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white`}
                      >
                        {progress > 0 ? "이어하기" : "시작하기"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
