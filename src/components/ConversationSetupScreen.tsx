import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ArrowLeft } from "lucide-react";

interface ConversationSetupScreenProps {
  onNavigate: (screen: string) => void;
  onStartConversation: (setup: ConversationSetup) => void;
  userJob: string;
}

export interface ConversationSetup {
  topic: string;
  userRole: string;
  aiRole: string;
  situation: string;
}

export function ConversationSetupScreen({ 
  onNavigate, 
  onStartConversation,
  userJob
}: ConversationSetupScreenProps) {
  const [topic, setTopic] = useState("");
  const [aiRole, setAiRole] = useState("");
  const [situation, setSituation] = useState("");

  const handleStart = () => {
    if (!topic.trim()) {
      alert("주제를 입력해주세요.");
      return;
    }
    if (!aiRole.trim()) {
      alert("AI 역할을 입력해주세요.");
      return;
    }

    const setup: ConversationSetup = {
      topic: topic.trim(),
      userRole: userJob,
      aiRole: aiRole.trim(),
      situation: situation.trim()
    };

    onStartConversation(setup);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onNavigate('home')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>AI 말하기 연습실</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>대화 설정</CardTitle>
            <CardDescription>
              AI와 연습할 대화 상황을 설정하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 주제 */}
            <div className="space-y-2">
              <Label htmlFor="topic">
                주제 <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 손님 맞이하기, 주문 받기, 전화 응대 등"
              />
            </div>

            {/* 나의 역할 (직무) */}
            <div className="space-y-2">
              <Label>나의 역할 (직무)</Label>
              <Input 
                value={userJob} 
                disabled 
                className="bg-gray-100"
              />
              <p className="text-sm text-gray-500">
                회원가입 시 선택한 직무가 자동으로 설정됩니다.
              </p>
            </div>

            {/* AI 역할 */}
            <div className="space-y-2">
              <Label htmlFor="ai-role">
                AI 역할 <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="ai-role"
                value={aiRole}
                onChange={(e) => setAiRole(e.target.value)}
                placeholder="예: 손님, 매니저, 동료, 신입직원 등"
              />
            </div>

            {/* 상황 설정 (프롬프트) */}
            <div className="space-y-2">
              <Label htmlFor="situation">
                상황 설정 (프롬프트) <span className="text-gray-400">(선택사항)</span>
              </Label>
              <Textarea 
                id="situation"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="예: 점심시간에 손님이 많이 몰려서 바쁜 상황입니다. 손님은 예약 없이 방문했고 4명입니다."
                rows={5}
              />
              <p className="text-sm text-gray-500">
                대화의 배경이나 특별한 상황을 자세히 설명해주세요.
              </p>
            </div>

            {/* Start Button */}
            <Button 
              className="w-full" 
              onClick={handleStart}
              size="lg"
            >
              대화 시작하기
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
