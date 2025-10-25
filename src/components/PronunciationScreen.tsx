import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Mic, Volume2, CheckCircle2, AlertCircle } from "lucide-react";

interface PronunciationScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: (defaultScreen: string) => void;
}

export function PronunciationScreen({ onNavigate, onBack }: PronunciationScreenProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleRecord = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
      // Simulate AI feedback
      setFeedback({
        score: 85,
        correctParts: ["손님", "계산", "도와드리겠습니다"],
        incorrectParts: [
          { word: "도와드리겠습니다", issue: "억양이 부자연스럽습니다" }
        ]
      });
    }, 2000);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack('sentenceLearning');
    } else {
      onNavigate('sentenceLearning');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>발음 연습</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Target Sentence */}
        <Card>
          <CardHeader>
            <CardTitle>연습할 문장</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg">
              <p className="text-center text-2xl mb-4">
                손님, 계산 도와드리겠습니다.
              </p>
              <div className="flex justify-center">
                <Button variant="outline">
                  <Volume2 className="w-5 h-5 mr-2" />
                  발음 듣기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recording Section */}
        <Card>
          <CardHeader>
            <CardTitle>녹음하기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-blue-500'
              }`}>
                <Mic className="w-12 h-12 text-white" />
              </div>
              <p className="text-gray-600 mb-4">
                {isRecording ? '녹음 중...' : '버튼을 눌러 녹음을 시작하세요'}
              </p>
              <Button 
                size="lg"
                onClick={handleRecord}
                disabled={isRecording}
              >
                {isRecording ? '녹음 중...' : hasRecorded ? '다시 녹음' : '녹음 시작'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        {feedback && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>AI 발음 평가</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white mb-4">
                    <div>
                      <div className="text-4xl">{feedback.score}</div>
                      <div className="text-sm">점</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="default" className="text-lg">
                      {feedback.score >= 80 ? '우수' : feedback.score >= 60 ? '보통' : '연습 필요'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">잘한 부분</div>
                      <div className="flex flex-wrap gap-2">
                        {feedback.correctParts.map((part: string, i: number) => (
                          <Badge key={i} variant="outline" className="bg-green-50">
                            {part}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {feedback.incorrectParts.map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="mb-1">
                          <Badge variant="outline" className="bg-orange-100">
                            {item.word}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{item.issue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleRecord}>
                다시 연습
              </Button>
              <Button className="flex-1" onClick={() => onNavigate('sentenceLearning')}>
                다음 문장으로
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
