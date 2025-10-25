import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
}

export function SignupScreen({ onNavigate }: SignupScreenProps) {
  const handleSignup = () => {
    onNavigate('levelTest');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Korean For You</h1>
          <p className="text-gray-600">요식업 외국인 근로자를 위한 실무 한국어</p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>
              새 계정을 만들어 학습을 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="example@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input 
                  id="nickname" 
                  type="text" 
                  placeholder="홍길동"
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
              <div className="space-y-2">
                <Label htmlFor="nationality">국적</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="국적을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="korea">대한민국</SelectItem>
                    <SelectItem value="vietnam">베트남</SelectItem>
                    <SelectItem value="philippines">필리핀</SelectItem>
                    <SelectItem value="thailand">태국</SelectItem>
                    <SelectItem value="nepal">네팔</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job">직무</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="직무를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chef">주방장</SelectItem>
                    <SelectItem value="kitchen-staff">주방 직원</SelectItem>
                    <SelectItem value="baker">제빵사</SelectItem>
                    <SelectItem value="server">홀 서빙</SelectItem>
                    <SelectItem value="cashier">계산 담당</SelectItem>
                    <SelectItem value="barista">바리스타</SelectItem>
                    <SelectItem value="dishwasher">세척 담당</SelectItem>
                    <SelectItem value="delivery">배달원</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-detail">구체적인 직무</Label>
                <Input 
                  id="job-detail" 
                  type="text" 
                  placeholder="ex) 치킨집, GS25"
                />
              </div>
            </div>
            
            <Button className="w-full mt-6" onClick={handleSignup}>
              가입하기
            </Button>
            
            <div className="text-center mt-4 space-y-2">
              <Button 
                variant="link" 
                onClick={() => onNavigate('login')}
                className="w-full"
              >
                이미 계정이 있으신가요? 로그인
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