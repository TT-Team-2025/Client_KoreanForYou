import { useState } from "react";
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
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>([]);
  

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

  const handleNavigate = (screen: Screen, data?: any) => {
    setNavigationHistory([...navigationHistory, currentScreen]);
    setCurrentScreen(screen);
    
    // 데이터가 전달된 경우 처리
    if (data?.chapter) {
      setSelectedChapter(data.chapter);
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

  const handleSelectChapter = (chapter: any) => {
    setSelectedChapter(chapter);
    handleNavigate('sentenceLearning');
  };

  const handleSelectLearningRecord = (record: any) => {
    setSelectedLearningRecord(record);
    handleNavigate('feedback');
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
        return <LevelUpScreen onNavigate={handleNavigate} newLevel={userData.level_id} previousLevel={userData.level_id - 1} />;
      case 'chapterList':
        return <ChapterListScreen onNavigate={handleNavigate} onBack={handleBack} onSelectChapter={handleSelectChapter} userJob={userData.job} userLevel={userData.level_id} />;
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
            userJob={userData.job}
          />
        );
      case 'conversation':
        return (
          <ConversationScreen
            onNavigate={handleNavigate}
            setup={conversationSetup}
            sessionData={sessionData}
            userName={userData.nickname}
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
        return <PostDetailScreen onNavigate={handleNavigate} />;
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
      {renderScreen()}
      <Toaster position="top-center" />
    </div>
  );
}