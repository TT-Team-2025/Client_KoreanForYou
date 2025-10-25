import { Button } from "./ui/button";
import { Home, BookOpen, MessageSquare, BarChart3, Users, User } from "lucide-react";
import K4YLogo from "../assets/K4Y_logo.png";

interface NavigationProps {
  onNavigate: (screen: string) => void;
  currentScreen?: string;
}

export function Navigation({ onNavigate, currentScreen }: NavigationProps) {
  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'chapterList', label: '문장 학습', icon: BookOpen },
    { id: 'conversationSetup', label: 'AI 연습', icon: MessageSquare },
    { id: 'progress', label: '학습 기록', icon: BarChart3 },
    { id: 'community', label: '커뮤니티', icon: Users },
  ];

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer w-48"
            onClick={() => onNavigate('home')}
          >
            <img src={K4YLogo} alt="Korean For You" className="h-10" />
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-12">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors ${
                    isActive 
                      ? 'border-red-600 text-red-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="w-48 flex justify-end">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => onNavigate('mypage')}
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t">
          <div className="grid grid-cols-5 gap-1 py-2">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded transition-colors ${
                    isActive 
                      ? 'text-red-600' 
                      : 'text-gray-500'
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}