import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Mic, Languages, PhoneOff } from "lucide-react";
import { ConversationSetup, StartScenarioResponse, Message } from "@/types/scenario";
import { getAudioFileUrl } from "@/api/scenario";
import { useSendVoiceMessage } from "@/hooks/scenarios/useSendVoiceMessage";
import { useSendMessage } from "@/hooks/scenarios/useSendMessage";
import { useEndScenario } from "@/hooks/scenarios/useEndScenario";
import { CONVERSATION_TEXT } from "@/constants/conversation";
import { LoadingOverlay } from "./LoadingOverlay";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import { translateText } from "@/utils/translate";

interface ConversationScreenProps {
  onNavigate: (screen: string) => void;
  setup: ConversationSetup;
  sessionData: StartScenarioResponse | null;
  onComplete?: (learningRecord: any) => void;
}


export function ConversationScreen({ onNavigate, setup, sessionData, onComplete }: ConversationScreenProps) {
  const [isRecording, setIsRecording] = useState(false); // 녹음 중
  const [isMuted, setIsMuted] = useState(false); // 음소거
  const [showTranslation, setShowTranslation] = useState(false); // 번역
  const [elapsedTime, setElapsedTime] = useState(0); // 타이머
  const [isAIResponding, setIsAIResponding] = useState(false); // AI 응답 대기 중
  const [isSTTProcessing, setIsSTTProcessing] = useState(false); // STT 변환 중
  const [translatingMessageIds, setTranslatingMessageIds] = useState<Set<number>>(new Set()); // 번역 중인 메시지 ID
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      speaker: "ai",
      text: sessionData?.assistant || "안녕하세요! 대화를 시작해볼까요?",
      translation: "",
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // 사용자 프로필 조회
  const { data: userProfile } = useUserProfile();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null); // 현재 재생 중인 TTS 오디오
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { mutate: sendVoice, isPending: isSendingVoice } = useSendVoiceMessage();
  const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessage();
  const { mutate: endScenario, isPending: isEndingScenario } = useEndScenario();

  // Play initial TTS audio
  useEffect(() => {
    if (sessionData?.tts_filename && !isMuted) {
      const audioUrl = getAudioFileUrl(sessionData.tts_filename);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      currentAudioRef.current = audio;

      audio.play().catch(error => {
        console.error('TTS 재생 실패:', error);
      });

      audio.onended = () => {
        currentAudioRef.current = null;
      };

      return () => {
        audio.pause();
        audio.src = '';
        currentAudioRef.current = null;
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

  // 번역 버튼을 누를 때 아직 번역되지 않은 메시지들을 번역
  useEffect(() => {
    if (showTranslation && userProfile?.nationality) {
      messages.forEach(async (message) => {
        // 이미 번역이 있거나 번역 중인 메시지는 스킵
        if (message.translation || translatingMessageIds.has(message.id)) {
          return;
        }

        // 번역 중 표시
        setTranslatingMessageIds(prev => new Set(prev).add(message.id));

        try {
          const translated = await translateText(message.text, userProfile.nationality!);

          // 메시지 업데이트
          setMessages(prev =>
            prev.map(msg =>
              msg.id === message.id
                ? { ...msg, translation: translated }
                : msg
            )
          );
        } catch (error) {
          console.error('번역 실패:', error);
        } finally {
          // 번역 완료
          setTranslatingMessageIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(message.id);
            return newSet;
          });
        }
      });
    }
  }, [showTranslation, messages, userProfile?.nationality, translatingMessageIds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecord = async () => {
    if (isMuted || !sessionData) return;

    if (isRecording) {
      // 녹음 중지
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    } else {
      // 녹음 시작 - 현재 재생 중인 모든 TTS 오디오 중지
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }

      // 녹음 시작
      try {
        // ✅ navigator.mediaDevices가 존재하는지 먼저 확인
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert('이 브라우저는 음성 녹음을 지원하지 않습니다. Chrome, Edge, Safari 최신 버전을 사용해주세요.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // 지원되는 MIME 타입 확인
        const mimeType = MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm';

        console.log(CONVERSATION_TEXT.CONSOLE.MIME_TYPE, mimeType);

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          setIsRecording(false);

          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
          const audioFile = new File([audioBlob], `voice.${extension}`, { type: mimeType });

          console.log(CONVERSATION_TEXT.CONSOLE.SENDING_FILE, {
            name: audioFile.name,
            type: audioFile.type,
            size: audioFile.size,
            threadId: sessionData.session_id
          });

          // ✅ 낙관적 업데이트 1: 사용자 메시지 즉시 표시 (임시 텍스트)
          const tempUserMessageId = Date.now();
          const tempUserMessage: Message = {
            id: tempUserMessageId,
            speaker: "user",
            text: "🎤 음성 인식 중...",  // 임시 텍스트
            translation: "",
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, tempUserMessage]);

          // 1단계: 음성 파일을 STT로 변환
          setIsSTTProcessing(true);

          sendVoice(
            {
              thread_id: sessionData.session_id,
              file: audioFile
            },
            {
              onSuccess: (sttData) => {
                // STT 로딩 종료
                setIsSTTProcessing(false);

                // ✅ STT 결과로 임시 메시지 업데이트
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === tempUserMessageId
                      ? { ...msg, text: sttData.user_text }  // 실제 STT 결과로 교체
                      : msg
                  )
                );

                // ✅ 낙관적 업데이트 2: AI 메시지 즉시 표시 (임시 텍스트)
                const tempAIMessageId = Date.now() + 1;
                const tempAIMessage: Message = {
                  id: tempAIMessageId,
                  speaker: "ai",
                  text: "💭 생각하는 중...",  // 임시 텍스트
                  translation: "",
                  timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, tempAIMessage]);

                // AI 응답 로딩 시작
                setIsAIResponding(true);

                // 2단계: STT 결과를 AI에게 전송하여 응답 받기
                sendMessage(
                  {
                    thread_id: sessionData.session_id,
                    message: sttData.user_text
                  },
                  {
                    onSuccess: (aiData) => {
                      // AI 응답 로딩 종료
                      setIsAIResponding(false);

                      // ✅ LLM 결과로 임시 메시지 업데이트
                      setMessages(prev =>
                        prev.map(msg =>
                          msg.id === tempAIMessageId
                            ? { ...msg, text: aiData.assistant }  // 실제 AI 응답으로 교체
                            : msg
                        )
                      );

                      // AI 응답 TTS 재생
                      if (aiData.tts_filename && !isMuted) {
                        const audioUrl = getAudioFileUrl(aiData.tts_filename);
                        const audio = new Audio(audioUrl);
                        currentAudioRef.current = audio;

                        audio.play().catch(error => {
                          console.error(CONVERSATION_TEXT.CONSOLE.TTS_PLAY_FAILED, error);
                        });

                        audio.onended = () => {
                          currentAudioRef.current = null;
                        };
                      }
                    },
                    onError: (error) => {
                      setIsAIResponding(false);

                      // ✅ 에러 발생 시 임시 메시지 제거
                      setMessages(prev => prev.filter(msg => msg.id !== tempAIMessageId));

                      alert(`AI 응답 받기 실패: ${error.message}`);
                    }
                  }
                );
              },
              onError: (error) => {
                setIsSTTProcessing(false);
                console.error('STT 처리 오류:', error);

                // ✅ 에러 발생 시 임시 메시지 업데이트
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === tempUserMessageId
                      ? { ...msg, text: "⚠️ 음성 인식 실패" }
                      : msg
                  )
                );

                alert('다시 녹음해주세요');
              }
            }
          );

          // 스트림 정리
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('마이크 접근 실패:', error);
        alert('마이크 접근 권한이 필요합니다.');
      }
    }
  };

  const handleEndConversation = () => {
    if (!sessionData) return;

    // 사용자 발화 횟수 계산 (첫 AI 메시지 제외)
    const userMessageCount = messages.filter(msg => msg.speaker === 'user').length;

    // 5문장 미만 발화 시 확인 메시지
    if (userMessageCount < 5) {
      const confirmEnd = window.confirm(
        `현재 ${userMessageCount}번 발화하셨습니다.\n5번 이상 발화해야 학습 기록이 저장됩니다.\n\n그래도 종료하시겠습니까?`
      );
      if (!confirmEnd) return;
    }

    // 현재 재생 중인 TTS 완전 종료
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    // 시나리오 종료 API 호출
    endScenario(
      {
        thread_id: sessionData.session_id
      },
      {
        onSuccess: (data) => {
          console.log('시나리오 종료 성공:', data);

          // AI 대화 완료 기록 생성 - 실제 피드백 데이터 포함
          const conversationRecord = {
            id: Date.now(),
            type: 'conversation',
            title: setup.topic || 'AI 대화 연습',
            date: new Date().toISOString().split('T')[0],
            duration: formatTime(data.total_time || elapsedTime),
            score: data.feedback?.detail_comment?.metrics_summary?.overall_score || 0,
            messageCount: data.turn_count || messages.length,
            completionStatus: data.completion_status,
            endTime: data.end_time,
            // 서버에서 받은 피드백 데이터 전체 포함
            feedback: data.feedback,
            threadId: data.thread_id,
            userRole: setup.userRole,
            aiRole: setup.aiRole,
            situation: setup.situation
          };
          console.log('AI 대화 완료 기록 확인 : ', conversationRecord)

          // 학습 기록을 전달하고 피드백으로 이동
          if (onComplete) {
            onComplete(conversationRecord);
          }
          onNavigate('feedback');
        },
        onError: (error) => {
          console.error('시나리오 종료 실패:', error);
          alert(`대화 종료 실패: ${error.message}`);
        }
      }
    );
  };

  return (
    <div className="min-h-screen relative flex flex-col" style={{
      background: 'linear-gradient(180deg, #3a3a3c 0%, #2d3561 70%, #3d4578 100%)'
    }}>
      {/* 종료 중 로딩 오버레이 */}
      {isEndingScenario && <LoadingOverlay message="대화를 종료하는 중입니다..." />}

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
                      {translatingMessageIds.has(message.id) ? (
                        <span className="flex gap-1">
                          번역 중
                          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                        </span>
                      ) : (
                        message.translation || '번역 중...'
                      )}
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

          {/* STT 처리 중 표시 (사용자 말풍선) */}
          {isSTTProcessing && (
            <div className="flex justify-end">
              <div className="max-w-[80%] items-end flex flex-col gap-1">
                <div className="px-4 py-3 rounded-2xl bg-white text-gray-900">
                  <div className="flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI 응답 로딩 중 표시 */}
          {isAIResponding && (
            <div className="flex justify-start">
              <div className="max-w-[80%] items-start flex flex-col gap-1">
                <div className="px-4 py-3 rounded-2xl bg-white/20 text-white">
                  <div className="flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Controls */}
      <div className="pb-8 pt-4 flex-shrink-0">
        <div className="flex items-center justify-center gap-8">
          {/* Microphone Button */}
          <Button
            onClick={handleRecord}
            disabled={isMuted || isSendingVoice || isSendingMessage}
            className={`w-16 h-16 rounded-full transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : isSendingVoice || isSendingMessage
                ? 'bg-blue-400 opacity-70'
                : 'bg-white/20 hover:bg-white/30 border-2 border-white'
            }`}
          >
            <Mic className="w-7 h-7 text-white" />
          </Button>

          {/* End Call Button (iPhone style) */}
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={handleEndConversation}
              disabled={isEndingScenario}
              className={`w-16 h-16 rounded-full transition-all ${
                isEndingScenario
                  ? 'bg-red-400 opacity-70'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
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
