import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import K4YLogo from "../assets/K4Y_logo.png";

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
  onSignupSuccess?: (userData: any) => void;
}

export function SignupScreen({ onNavigate, onSignupSuccess }: SignupScreenProps) {
  // ✅ 입력값 상태
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    nationality: "",
    job: "",
    level: "",
  });

  // ✅ 상태 변경 핸들러
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ 폼 제출 이벤트
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (!form.email || !form.password || !form.nickname) {
      alert("이메일, 비밀번호, 닉네임은 필수 입력 항목입니다.");
      return;
    }

    // 추후 백엔드 API 연결 (지금은 mock)
    const userData = {
      email: form.email,
      nickname: form.nickname,
      nationality: form.nationality,
      job: form.job,
      level: form.level,
    };

    console.log("회원가입 시도:", userData);

    // 회원가입 성공 처리
    if (onSignupSuccess) onSignupSuccess(userData);
    onNavigate("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-4">
      <div className="w-full max-w-2xl">
        {/* 로고 */}
        <div className="text-center mb-8">
          <img src={K4YLogo} alt="Korean For You" className="h-16 mx-auto mb-4" />
          <p className="text-gray-600">요식업 외국인 근로자를 위한 실무 한국어</p>
        </div>

        {/* 카드 */}
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">회원가입</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이메일 */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
              </div>

              {/* 닉네임 */}
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  placeholder="닉네임을 입력하세요"
                  value={form.nickname}
                  onChange={(e) => handleChange("nickname", e.target.value)}
                  required
                />
              </div>

              {/* 국적 */}
              <div className="space-y-2">
                <Label htmlFor="nationality">국적</Label>
                <Select
                  onValueChange={(val) => handleChange("nationality", val)}
                  value={form.nationality}
                >
                  <SelectTrigger id="nationality">
                    <SelectValue placeholder="국적을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-md">
                    <SelectItem value="KR">한국</SelectItem>
                    <SelectItem value="VN">베트남</SelectItem>
                    <SelectItem value="TH">태국</SelectItem>
                    <SelectItem value="PH">필리핀</SelectItem>
                    <SelectItem value="ETC">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 직무 */}
              <div className="space-y-2">
                <Label htmlFor="job">직무</Label>
                <Select
                  onValueChange={(val) => handleChange("job", val)}
                  value={form.job}
                >
                  <SelectTrigger id="job">
                    <SelectValue placeholder="직무를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-md">
                    <SelectItem value="1">요식업</SelectItem>
                    <SelectItem value="2">제조업</SelectItem>
                    <SelectItem value="3">배달직</SelectItem>
                    <SelectItem value="4">서비스직</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 한국어 수준 */}
              <div className="space-y-2">
                <Label htmlFor="level">한국어 수준</Label>
                <Select
                  onValueChange={(val) => handleChange("level", val)}
                  value={form.level}
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="한국어 수준을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-md">
                    <SelectItem value="1">초급</SelectItem>
                    <SelectItem value="2">중급</SelectItem>
                    <SelectItem value="3">고급</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 제출 버튼 */}
              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                회원가입
              </Button>
            </form>

            {/* 하단 네비게이션 */}
            <div className="text-center space-y-2 mt-4">
              <Button
                variant="link"
                onClick={() => onNavigate("login")}
                className="w-full"
              >
                이미 계정이 있으신가요? 로그인
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate("landing")}
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
