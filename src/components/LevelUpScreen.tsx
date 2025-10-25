import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Award,
  Star,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { getLevelName } from "../types";

interface LevelUpScreenProps {
  onNavigate: (screen: string) => void;
  newLevel: number; // 새로 달성한 레벨
  previousLevel: number; // 이전 레벨
}

export function LevelUpScreen({
  onNavigate,
  newLevel,
  previousLevel,
}: LevelUpScreenProps) {
  const newLevelName = getLevelName(newLevel);
  const previousLevelName = getLevelName(previousLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Celebration Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <Award className="w-32 h-32 text-yellow-500 animate-bounce" />
            <Sparkles className="w-8 h-8 text-yellow-400 absolute top-0 right-0 animate-pulse" />
            <Star className="w-6 h-6 text-orange-400 absolute bottom-0 left-0 animate-pulse" />
          </div>
          <div>
            <h1 className="text-4xl mb-2">축하합니다!</h1>
            <p className="text-xl text-gray-700">
              레벨업을 달성했습니다!
            </p>
          </div>
        </div>

        {/* Level Change Card */}
        <Card className="border-2 border-yellow-300 bg-white shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge
                variant="outline"
                className="text-lg py-2 px-4"
              >
                {previousLevelName}
              </Badge>
              <TrendingUp className="w-6 h-6 text-green-500" />
              <Badge
                variant="default"
                className="text-lg py-2 px-4 bg-gradient-to-r from-yellow-500 to-orange-500"
              >
                {newLevelName}
              </Badge>
            </div>
            <CardTitle className="text-2xl">
              {newLevelName} 레벨 달성!
            </CardTitle>
            <CardDescription>
              꾸준한 학습으로 새로운 단계에 도달했습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Unlocked Features */}
            <div>
              <h3 className="mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                새로 열린 기능
              </h3>
              <div className="space-y-2 bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>{newLevelName} 챕터 학습 가능</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>새로운 직무별 문장 학습</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>고급 AI 대화 시나리오</span>
                </div>
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-3xl mb-1">🎯</div>
                <div className="text-sm text-gray-600">
                  학습 시간
                </div>
                <div className="text-lg">24시간</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <div className="text-3xl mb-1">📚</div>
                <div className="text-sm text-gray-600">
                  완료 문장
                </div>
                <div className="text-lg">156개</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <div className="text-3xl mb-1">💬</div>
                <div className="text-sm text-gray-600">
                  AI 대화
                </div>
                <div className="text-lg">12회</div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <p className="text-center text-gray-700">
                <span className="text-purple-700">
                  "{previousLevelName}에서 {newLevelName}까지!"
                </span>
                <br />
                꾸준한 노력의 결과입니다. 계속 이렇게 학습하시면
                <br />
                실전에서도 자신감 있게 한국어를 사용하실 수 있을
                거예요!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onNavigate("progress")}
              >
                학습 기록 보기
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                onClick={() => onNavigate("chapterList")}
              >
                새 챕터 학습하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}