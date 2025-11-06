import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Mic, Languages, PhoneOff } from "lucide-react";
import { ConversationSetup, StartScenarioResponse } from "@/types/scenario";
import { getAudioFileUrl } from "@/api/scenario";

interface ConversationScreenProps {
  onNavigate: (screen: string) => void;
  setup: ConversationSetup;
  sessionData: StartScenarioResponse | null;
  userName: string;
  onComplete?: (learningRecord: any) => void;
}

interface Message {
  id: number;
  speaker: "ai" | "user";
  text: string;
  translation: string;
  timestamp: string;
}

export function ConversationScreen({ onNavigate, setup, sessionData, userName, onComplete }: ConversationScreenProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      speaker: "ai",
      text: sessionData?.assistant || `안녕하세요, ${userName}님! 오늘 기분은 어떠세요?`,
      translation: `Good evening, ${userName}! How are you feeling today?`,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play initial TTS audio
  useEffect(() => {
    if (sessionData?.tts_filename && !isMuted) {
      const audioUrl = getAudioFileUrl(sessionData.tts_filename);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.play().catch(error => {
        console.error('TTS 재생 실패:', error);
      });

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [sessionData, isMuted]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecord = () => {
    if (isMuted) return;
    
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      // Simulate user response
      const newMessage: Message = {
        id: messages.length + 1,
        speaker: "user",
        text: "네, 괜찮아요. 오늘 많이 바쁘시죠?",
        translation: "Yes, I'm fine. You must be very busy today, right?",
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
      
      // AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: messages.length + 2,
          speaker: "ai",
          text: "네, 오늘 손님이 많아서 정신이 없네요. 도와주셔서 감사합니다.",
          translation: "Yes, we have many customers today, so it's hectic. Thank you for your help.",
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }, 2000);
  };

  const handleEndConversation = () => {
    // AI 대화 완료 기록 생성
    const conversationRecord = {
      id: Date.now(),
      type: 'conversation',
      title: setup.topic || 'AI 대화 연습',
      date: new Date().toISOString().split('T')[0],
      duration: formatTime(elapsedTime),
      score: 88,
      messageCount: messages.length
    };
    
    // 학습 기록을 전달하고 피드백으로 이동
    if (onComplete) {
      onComplete(conversationRecord);
    }
    onNavigate('feedback');
  };

  return (
    <div className="min-h-screen relative flex flex-col" style={{
      background: 'linear-gradient(180deg, #3a3a3c 0%, #2d3561 70%, #3d4578 100%)'
    }}>
      {/* Header */}
      <header className="flex items-center justify-center px-5 pt-4 pb-4 relative">
        <div className="absolute left-5">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowTranslation(!showTranslation)}
            className={`text-white hover:bg-white/10 ${showTranslation ? 'bg-white/20' : ''}`}
          >
            <Languages className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="text-white text-lg">{formatTime(elapsedTime)}</div>
      </header>

      {/* Topic & Role Info */}
      <div className="px-6 pb-4 flex-shrink-0">
        <div className="flex justify-center mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10">
            <span className="text-white text-sm">{setup.topic}</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center text-xs">
          <div className="text-white/70">
            나: <span className="text-white">{setup.userRole}</span>
          </div>
          <div className="text-white/70">
            AI: <span className="text-white">{setup.aiRole}</span>
          </div>
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <main className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.speaker === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.speaker === 'ai'
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-gray-900'
                  }`}
                >
                  <p className="leading-relaxed">{message.text}</p>
                  {showTranslation && (
                    <p className={`text-sm mt-2 pt-2 border-t italic ${
                      message.speaker === 'ai' 
                        ? 'border-white/20 text-white/70' 
                        : 'border-gray-200 text-gray-600'
                    }`}>
                      {message.translation}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2 ${
                  message.speaker === 'ai' ? 'text-white/50' : 'text-white/50'
                }`}>
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Controls */}
      <div className="pb-8 pt-4 flex-shrink-0">
        <div className="flex items-center justify-center gap-8">
          {/* Microphone Button */}
          <Button
            onClick={handleRecord}
            disabled={isRecording || isMuted}
            className={`w-16 h-16 rounded-full transition-all ${
              isRecording 
                ? 'bg-blue-500 hover:bg-blue-600 animate-pulse' 
                : 'bg-white/20 hover:bg-white/30 border-2 border-white'
            }`}
          >
            <Mic className="w-7 h-7 text-white" />
          </Button>
          
          {/* End Call Button (iPhone style) */}
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={handleEndConversation}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-all"
            >
              <PhoneOff className="w-7 h-7 text-white" />
            </Button>
            <span className="text-white/80 text-sm">종료</span>
          </div>
          
          {/* Mute Button */}
          <Button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full transition-all ${
              isMuted 
                ? 'bg-red-500/20 border-2 border-red-500' 
                : 'bg-white/20 hover:bg-white/30 border-2 border-white'
            }`}
          >
            <span className="text-white text-2xl">{isMuted ? '🔇' : '🔊'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
