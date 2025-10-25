import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { BookOpen, MessageSquare, TrendingUp, Users, Award, CheckCircle, Globe, Clock } from "lucide-react";
import K4YLogo from "../assets/K4Y_logo.png";

interface LandingPageProps {
  onNavigate: (screen: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: BookOpen,
      title: "문장 학습실",
      description: "직무별 맞춤형 한국어 문장을 체계적으로 학습하세요",
      color: "text-blue-500"
    },
    {
      icon: MessageSquare,
      title: "AI 말하기 연습",
      description: "실제 업무 상황을 AI와 대화하며 실전 연습",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      title: "학습 기록 관리",
      description: "나의 학습 진행 상황을 한눈에 확인하고 관리",
      color: "text-orange-500"
    },
    {
      icon: Users,
      title: "커뮤니티",
      description: "다른 학습자들과 정보를 공유하고 소통",
      color: "text-purple-500"
    }
  ];

  const jobCategories = [
    "주방보조", "서빙", "바리스타", "캐셔", "배달", "주방장", "설거지"
  ];

  const benefits = [
    "7가지 직무별 맞춤 학습 콘텐츠",
    "초급/중급/고급 단계별 커리큘럼",
    "실시간 발음 피드백",
    "AI 기반 대화 연습",
    "학습 진도 추적 및 분석",
    "커뮤니티 Q&A 지원"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={K4YLogo} alt="Korean For You" className="h-10" />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => onNavigate('login')}>
                로그인
              </Button>
              <Button onClick={() => onNavigate('signup')}>
                무료 시작하기
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 via-white to-red-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
                <Globe className="w-4 h-4" />
                <span className="text-sm">요식업 외국인 근로자를 위한</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl">
                실무 한국어,
                <br />
                <span className="text-red-600">쉽고 빠르게</span>
              </h1>
              
              <p className="text-xl text-gray-600">
                7가지 직무별 맞춤 학습과 AI 대화 연습으로
                <br />
                업무에 필요한 한국어를 효과적으로 배우세요
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => onNavigate('signup')} className="px-8">
                  무료로 시작하기
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('login')} className="px-8">
                  로그인
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl text-red-600">1,000+</div>
                  <div className="text-sm text-gray-600">학습 문장</div>
                </div>
                <div>
                  <div className="text-3xl text-red-600">7개</div>
                  <div className="text-sm text-gray-600">직무 분야</div>
                </div>
                <div>
                  <div className="text-3xl text-red-600">24/7</div>
                  <div className="text-sm text-gray-600">AI 연습</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">오늘의 문장</div>
                      <div>손님, 계산 도와드리겠습니다</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">주간 학습 진행률</span>
                      <span>75%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-400 to-red-600 w-3/4 rounded-full"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <div className="text-sm text-gray-600">학습시간</div>
                      <div>12시간</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Award className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                      <div className="text-sm text-gray-600">완료문장</div>
                      <div>156개</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
                      <div className="text-sm text-gray-600">연속학습</div>
                      <div>5일</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-200 to-red-300 rounded-2xl transform rotate-3 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">7가지 직무별 맞춤 학습</h2>
            <p className="text-xl text-gray-600">
              나의 직무에 맞는 실무 한국어를 배우세요
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {jobCategories.map((job, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-white border-2 border-red-200 rounded-full hover:border-red-500 hover:shadow-lg transition-all cursor-pointer"
              >
                {job}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">효과적인 학습 기능</h2>
            <p className="text-xl text-gray-600">
              실무에 바로 적용할 수 있는 실전 한국어 학습
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-2 hover:border-red-200">
                <CardHeader>
                  <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl mb-6">
                왜 Korean For You인가요?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-2 border-red-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">학습 프로세스</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="mb-1">레벨 테스트</div>
                    <p className="text-sm text-gray-600">나의 한국어 수준을 확인하고 적절한 레벨로 시작</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="mb-1">직무별 문장 학습</div>
                    <p className="text-sm text-gray-600">직무에 맞는 실무 문장을 체계적으로 학습</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="mb-1">AI 대화 연습</div>
                    <p className="text-sm text-gray-600">실제 업무 상황을 AI와 대화하며 반복 연습</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <div className="mb-1">피드백 & 개선</div>
                    <p className="text-sm text-gray-600">학습 기록을 분석하고 부족한 부분을 집중 학습</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 opacity-90">
            무료로 가입하고 실무 한국어 학습을 시작해보세요
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => onNavigate('signup')} className="px-8">
              무료 회원가입
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('login')} className="px-8 bg-transparent text-white border-white hover:bg-white hover:text-red-600">
              로그인
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src={K4YLogo} alt="Korean For You" className="h-8 mb-4" />
              <p className="text-sm">
                요식업 외국인 근로자를 위한 실무 한국어 학습 플랫폼
              </p>
            </div>
            <div>
              <h3 className="text-white mb-4">학습</h3>
              <ul className="space-y-2 text-sm">
                <li>문장 학습실</li>
                <li>AI 말하기 연습</li>
                <li>레벨 테스트</li>
                <li>학습 기록</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white mb-4">커뮤니티</h3>
              <ul className="space-y-2 text-sm">
                <li>Q&A</li>
                <li>생활정보</li>
                <li>공지사항</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white mb-4">지원</h3>
              <ul className="space-y-2 text-sm">
                <li>도움말</li>
                <li>문의하기</li>
                <li>개인정보처리방침</li>
                <li>이용약관</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2025 Korean For You. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
