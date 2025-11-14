import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ArrowLeft } from "lucide-react";
import { ConversationSetup, StartScenarioResponse } from "@/types/scenario";
import { validateConversationSetup } from "@/utils/conversationValidation";
import { CONVERSATION_SETUP_TEXT, SITUATION_TEXTAREA_ROWS } from "@/constants/conversationSetup";
import { useStartScenario } from "@/hooks/scenarios/useStartScenario";
import { LoadingOverlay } from "./LoadingOverlay";

interface ConversationSetupScreenProps {
  onNavigate: (screen: string) => void;
  onStartConversation: (setup: ConversationSetup, sessionData: StartScenarioResponse) => void;
  userJob: string;
}

export function ConversationSetupScreen({
  onNavigate,
  onStartConversation,
  userJob
}: ConversationSetupScreenProps) {
  const [topic, setTopic] = useState("");
  const [userRole, setUserRole] = useState(userJob);
  const [aiRole, setAiRole] = useState("");
  const [situation, setSituation] = useState("");

  const { mutate: startScenario, isPending } = useStartScenario();

  const handleStart = () => {
    const validation = validateConversationSetup(topic, userRole, aiRole);
    if (!validation.isValid) {
      alert(validation.errorMessage);
      return;
    }
    const setup: ConversationSetup = {
      topic: topic.trim(),
      userRole: userRole.trim(),
      aiRole: aiRole.trim(),
      situation: situation.trim()
    };

    // API 호출하여 세션 시작
    startScenario(
      {
        topic: setup.topic,
        my_role: setup.userRole,
        ai_role: setup.aiRole,
        description: setup.situation || undefined,
      },
      {
        onSuccess: (data) => {
          onStartConversation(setup, data);
        },
        onError: (error) => {
          alert(`대화 시작에 실패했습니다: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 대화 시작 중 로딩 오버레이 */}
      {isPending && <LoadingOverlay message="대화를 시작하는 중입니다..." />}

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
          <h1>{CONVERSATION_SETUP_TEXT.HEADER.TITLE}</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>{CONVERSATION_SETUP_TEXT.CARD.TITLE}</CardTitle>
            <CardDescription>
              {CONVERSATION_SETUP_TEXT.CARD.DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 주제 */}
            <div className="space-y-2">
              <Label htmlFor="topic">
                {CONVERSATION_SETUP_TEXT.FIELDS.TOPIC.LABEL} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={CONVERSATION_SETUP_TEXT.FIELDS.TOPIC.PLACEHOLDER}
              />
            </div>

            {/* 나의 역할 (직무) */}
            <div className="space-y-2">
              <Label htmlFor="user-role">
                {CONVERSATION_SETUP_TEXT.FIELDS.USER_ROLE.LABEL} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="user-role"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="예: 서버, 주방보조, 바리스타 등"
              />
              <p className="text-sm text-gray-500">
                회원가입 시 선택한 직무가 기본값으로 설정되며, 수정 가능합니다.
              </p>
            </div>

            {/* AI 역할 */}
            <div className="space-y-2">
              <Label htmlFor="ai-role">
                {CONVERSATION_SETUP_TEXT.FIELDS.AI_ROLE.LABEL} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ai-role"
                value={aiRole}
                onChange={(e) => setAiRole(e.target.value)}
                placeholder={CONVERSATION_SETUP_TEXT.FIELDS.AI_ROLE.PLACEHOLDER}
              />
            </div>

            {/* 상황 설정 (프롬프트) */}
            <div className="space-y-2">
              <Label htmlFor="situation">
                {CONVERSATION_SETUP_TEXT.FIELDS.SITUATION.LABEL} <span className="text-gray-400">(선택사항)</span>
              </Label>
              <Textarea
                id="situation"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder={CONVERSATION_SETUP_TEXT.FIELDS.SITUATION.PLACEHOLDER}
                rows={SITUATION_TEXTAREA_ROWS}
              />
              <p className="text-sm text-gray-500">
                {CONVERSATION_SETUP_TEXT.FIELDS.SITUATION.HELPER_TEXT}
              </p>
            </div>

            {/* Start Button */}
            <Button
              className="w-full"
              onClick={handleStart}
              size="lg"
              disabled={isPending}
            >
              {isPending ? "대화 시작 중..." : CONVERSATION_SETUP_TEXT.BUTTONS.START}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
