import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import K4YLogo from "../assets/K4Y_logo.png";

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const handleLogin = () => {
    onNavigate('home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={K4YLogo} alt="Korean For You" className="h-16 mx-auto mb-4" />
          <p className="text-gray-600">요식업 외국인 근로자를 위한 실무 한국어</p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>
              계정에 로그인하여 학습을 계속하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
              />
            </div>
            <Button className="w-full" onClick={handleLogin}>
              로그인
            </Button>
            <div className="text-center space-y-2">
              <Button 
                variant="link" 
                onClick={() => onNavigate('signup')}
                className="w-full"
              >
                계정이 없으신가요? 회원가입
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => onNavigate('landing')}
                className="w-full text-sm"
              >
                ← 메인 페이지로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}