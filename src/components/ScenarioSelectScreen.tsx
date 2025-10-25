import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Users, Play } from "lucide-react";

interface ScenarioSelectScreenProps {
  onNavigate: (screen: string) => void;
}

const scenarios = [
  {
    id: 1,
    title: "손님 맞이하기",
    description: "손님이 식당에 들어올 때 인사하고 안내하기",
    difficulty: "초급",
    duration: "5분",
    roles: ["직원", "손님"]
  },
  {
    id: 2,
    title: "주문 받기",
    description: "손님의 주문을 정확하게 받고 확인하기",
    difficulty: "초급",
    duration: "7분",
    roles: ["직원", "손님"]
  },
  {
    id: 3,
    title: "메뉴 추천하기",
    description: "손님 취향에 맞는 메뉴 추천하기",
    difficulty: "중급",
    duration: "8분",
    roles: ["직원", "손님"]
  },
  {
    id: 4,
    title: "계산하기",
    description: "계산 처리와 영수증 발급하기",
    difficulty: "중급",
    duration: "5분",
    roles: ["직원", "손님"]
  },
  {
    id: 5,
    title: "불만 고객 응대",
    description: "불만이 있는 손님을 정중하게 대응하기",
    difficulty: "고급",
    duration: "10분",
    roles: ["직원", "손님"]
  },
  {
    id: 6,
    title: "전화 예약 받기",
    description: "전화로 예약을 받고 정보 기록하기",
    difficulty: "고급",
    duration: "8분",
    roles: ["직원", "손님"]
  }
];

const difficultyColor = {
  "초급": "bg-green-100 text-green-700 border-green-200",
  "중급": "bg-blue-100 text-blue-700 border-blue-200",
  "고급": "bg-purple-100 text-purple-700 border-purple-200"
};

export function ScenarioSelectScreen({ onNavigate }: ScenarioSelectScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('home')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>AI 말하기 연습실</h1>
            <p className="text-sm text-gray-600">실전 대화 시나리오를 선택하세요</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-4">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle>{scenario.title}</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={difficultyColor[scenario.difficulty as keyof typeof difficultyColor]}
                  >
                    {scenario.difficulty}
                  </Badge>
                </div>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{scenario.roles.join(", ")}</span>
                  </div>
                  <div>⏱️ {scenario.duration}</div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => onNavigate('conversationSetup')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  시작하기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="mb-1">AI 연습 팁</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 실제 상황처럼 자연스럽게 말해보세요</li>
                  <li>• AI가 실시간으로 발음과 억양을 피드백해줍니다</li>
                  <li>• 어려운 부분은 반복해서 연습할 수 있습니다</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
