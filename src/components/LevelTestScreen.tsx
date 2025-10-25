import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface LevelTestScreenProps {
  onNavigate: (screen: string) => void;
}

const levels = [
  {
    id: "beginner",
    title: "듣기만 가능해요",
    description: "손님/동료의 요청을 이해할 수 있어요"
  },
  {
    id: "intermediate",
    title: "기본 업무 대화가 가능해요",
    description: "주문 받기, 간단한 안내 등이 가능해요"
  },
  {
    id: "advanced",
    title: "복잡한 상황 대응이 가능해요",
    description: "문제 상황 설명, 상세한 안내 등이 가능해요"
  }
];

export function LevelTestScreen({ onNavigate }: LevelTestScreenProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  const handleSubmit = () => {
    if (selectedLevel) {
      onNavigate('levelTestResult');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-6">
          <h1 className="mb-2">한국어 레벨 테스트</h1>
          <p className="text-gray-600">현재 한국어 수준을 선택해주세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>나의 한국어 실력은?</CardTitle>
            <CardDescription>
              업무 환경에서 사용하는 한국어 수준을 평가해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedLevel} onValueChange={setSelectedLevel}>
              <div className="space-y-4">
                {levels.map((level) => (
                  <div 
                    key={level.id} 
                    className="flex items-start space-x-3 p-5 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedLevel(level.id)}
                  >
                    <RadioGroupItem 
                      value={level.id} 
                      id={level.id} 
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={level.id} className="cursor-pointer block mb-2">
                        {level.title}
                      </Label>
                      <p className="text-gray-600 text-sm">
                        {level.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={!selectedLevel}
            >
              시작하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
