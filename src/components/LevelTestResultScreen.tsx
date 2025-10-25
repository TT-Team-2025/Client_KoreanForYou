import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Award, CheckCircle2 } from "lucide-react";

interface LevelTestResultScreenProps {
  onNavigate: (screen: string) => void;
}

export function LevelTestResultScreen({ onNavigate }: LevelTestResultScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Award className="w-20 h-20 text-yellow-500" />
            </div>
            <CardTitle>테스트 완료!</CardTitle>
            <CardDescription>
              당신의 한국어 수준이 평가되었습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-8 rounded-lg text-center">
              <div className="mb-2">당신의 레벨</div>
              <div className="text-5xl mb-2">중급</div>
              <Badge variant="secondary" className="bg-white text-blue-600">
                Level 2
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span>정답률</span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  4/5 (80%)
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="mb-2">추천 학습 경로</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>중급 레벨의 챕터부터 시작하세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>AI 말하기 연습으로 실전 회화를 연습하세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>매일 20분씩 꾸준히 학습하면 빠르게 향상됩니다</span>
                </li>
              </ul>
            </div>

            <Button className="w-full" onClick={() => onNavigate('home')}>
              학습 시작하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
