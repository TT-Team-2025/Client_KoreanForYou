import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { HomeScreen } from "./components/HomeScreen";
import { LevelTestScreen } from "./components/LevelTestScreen";
import { LevelTestResultScreen } from "./components/LevelTestResultScreen";
import { LevelUpScreen } from "./components/LevelUpScreen";
import { ChapterListScreen } from "./components/ChapterListScreen";
import { SentenceLearningScreen } from "./components/SentenceLearningScreen";
import { PronunciationScreen } from "./components/PronunciationScreen";
import { ScenarioSelectScreen } from "./components/ScenarioSelectScreen";
import { ConversationSetupScreen } from "./components/ConversationSetupScreen";
import { ConversationScreen } from "./components/ConversationScreen";
import { FeedbackScreen } from "./components/FeedbackScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import { CommunityScreen } from "./components/CommunityScreen";
import { PostDetailScreen } from "./components/PostDetailScreen";
import { PostCreateScreen } from "./components/PostCreateScreen";
import { MyPageScreen } from "./components/MyPageScreen";
import { PasswordChangeScreen } from "./components/PasswordChangeScreen";
import { LanguageSettingsScreen } from "./components/LanguageSettingsScreen";
import { MyPostsScreen } from "./components/MyPostsScreen";
import { MyCommentsScreen } from "./components/MyCommentsScreen";
import { Navigation } from "./components/Navigation";
import { Toaster } from "./components/ui/sonner";
import type { ConversationSetup, StartScenarioResponse } from "./types/scenario";

type Screen = 
  | 'landing'
  | 'login' 
  | 'signup' 
  | 'home' 
  | 'levelTest' 
  | 'levelTestResult'
  | 'levelUp'
  | 'chapterList'
  | 'sentenceLearning'
  | 'pronunciation'
  | 'scenarioSelect'
  | 'conversationSetup'
  | 'conversation'
  | 'feedback'
  | 'progress'
  | 'community'
  | 'postDetail'
  | 'postCreate'
  | 'mypage'
  | 'passwordChange'
  | 'languageSettings'
  | 'myPosts'
  | 'myComments';

export default function App() {
  // ✅ 로그인 상태 확인하여 초기 화면 설정
  const getInitialScreen = (): Screen => {
    const accessToken = localStorage.getItem('access_token');
    return accessToken ? 'home' : 'landing';
  };

  const [currentScreen, setCurrentScreen] = useState<Screen>(getInitialScreen);
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>([]);

  // ✅ 토큰 변경 감지 (로그아웃 시 자동으로 랜딩 페이지로 이동)
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken && currentScreen !== 'landing' && currentScreen !== 'login' && currentScreen !== 'signup') {
        setCurrentScreen('landing');
      }
    };

    // 주기적으로 토큰 확인
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, [currentScreen]);

  // Conversation setup data
  const [conversationSetup, setConversationSetup] = useState<ConversationSetup>({
    topic: "",
    userRole: "",
    aiRole: "",
    situation: ""
  });

  // Session data from API
  const [sessionData, setSessionData] = useState<StartScenarioResponse | null>(null);

  // Selected chapter data for sentence learning
  const [selectedChapter, setSelectedChapter] = useState<any>(null);

  // Selected learning record for viewing results
  const [selectedLearningRecord, setSelectedLearningRecord] = useState<any>(null);

  // Selected post for post detail
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleNavigate = (screen: Screen, data?: any) => {
    setNavigationHistory([...navigationHistory, currentScreen]);
    setCurrentScreen(screen);

    // 데이터가 전달된 경우 처리
    if (data?.chapter) {
      setSelectedChapter(data.chapter);
    }

    if (data?.postId) {
      setSelectedPostId(data.postId);
    }

    // ✅ feedback 화면으로 이동할 때 학습 기록 데이터 저장
    if (screen === 'feedback' && data) {
      console.log("📤 [App.tsx] Setting selectedLearningRecord:", data);
      setSelectedLearningRecord(data);
    }

    window.scrollTo(0, 0);
  };

  const handleBack = (defaultScreen: Screen) => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen(defaultScreen);
    }
    window.scrollTo(0, 0);
  };

  const handleStartConversation = (setup: ConversationSetup, sessionResponse: StartScenarioResponse) => {
    setConversationSetup(setup);
    setSessionData(sessionResponse);
    handleNavigate('conversation');
  };

  const handleSelectLearningRecord = (record: any) => {
    setSelectedLearningRecord(record);
    handleNavigate('feedback');
  };

  // 네비게이션 바를 표시할지 여부 결정
  const shouldShowNavigation = () => {
    return currentScreen !== 'landing' && currentScreen !== 'login' && currentScreen !== 'signup';
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginScreen onNavigate={handleNavigate} />;
      case 'signup':
        return <SignupScreen onNavigate={handleNavigate} />;
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} onSelectLearningRecord={handleSelectLearningRecord} />;
      case 'levelTest':
        return <LevelTestScreen onNavigate={handleNavigate} />;
      case 'levelTestResult':
        return <LevelTestResultScreen onNavigate={handleNavigate} />;
      case 'levelUp':
        return <LevelUpScreen onNavigate={handleNavigate} newLevel={2} previousLevel={1} />;
      case 'chapterList':
        return <ChapterListScreen onNavigate={handleNavigate} />;
      case 'sentenceLearning':
        return <SentenceLearningScreen onNavigate={handleNavigate} onBack={handleBack} chapter={selectedChapter} onComplete={setSelectedLearningRecord} />;
      case 'pronunciation':
        return <PronunciationScreen onNavigate={handleNavigate} onBack={handleBack} />;
      case 'scenarioSelect':
        return <ScenarioSelectScreen onNavigate={handleNavigate} />;
      case 'conversationSetup':
        return (
          <ConversationSetupScreen
            onNavigate={handleNavigate}
            onStartConversation={handleStartConversation}
          />
        );
      case 'conversation':
        return (
          <ConversationScreen
            onNavigate={handleNavigate}
            setup={conversationSetup}
            sessionData={sessionData}
            onComplete={setSelectedLearningRecord}
          />
        );
      case 'feedback':
        return <FeedbackScreen onNavigate={handleNavigate} learningRecord={selectedLearningRecord} />;
      case 'progress':
        return <ProgressScreen onNavigate={handleNavigate} onBack={handleBack} onSelectLearningRecord={handleSelectLearningRecord} />;
      case 'community':
        return <CommunityScreen onNavigate={handleNavigate} onBack={handleBack} />;
      case 'postDetail':
        return <PostDetailScreen onNavigate={handleNavigate} postId={selectedPostId || 1} />;
      case 'postCreate':
        return <PostCreateScreen onNavigate={handleNavigate} />;
      case 'mypage':
        return <MyPageScreen onNavigate={handleNavigate} />;
      case 'passwordChange':
        return <PasswordChangeScreen onNavigate={handleNavigate} />;
      case 'languageSettings':
        return <LanguageSettingsScreen onNavigate={handleNavigate} />;
      case 'myPosts':
        return <MyPostsScreen onNavigate={handleNavigate} />;
      case 'myComments':
        return <MyCommentsScreen onNavigate={handleNavigate} />;
      default:
        return <LoginScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {shouldShowNavigation() && <Navigation onNavigate={handleNavigate} currentScreen={currentScreen} />}
      {renderScreen()}
      <Toaster position="top-center" />
    </div>
  );
}