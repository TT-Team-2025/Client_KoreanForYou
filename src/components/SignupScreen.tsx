/**
 * ==========================================================
 * 📁 파일명: SignupScreen.tsx
 * 📜 역할: 회원가입 화면 (백엔드 /auth/signup API 연동)
 * ==========================================================
 *
 * ✅ 핵심 기능 요약
 * 1️⃣ 사용자로부터 이메일, 비밀번호, 닉네임, 국적, 직무, 한국어 수준, 구체적 직무(description) 입력받기
 * 2️⃣ 입력값을 FastAPI 백엔드의 /auth/signup 엔드포인트로 전송
 * 3️⃣ 성공 시 → "회원가입 성공" 알림 후 로그인 페이지로 이동
 * ==========================================================
 */

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import api from "../api/axiosInstance";
import K4YLogo from "../assets/K4Y_logo.png";

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
  onSignupSuccess?: (userData: any) => void;
}

// ✅ 직무 문자열 ↔ 숫자 매핑
const jobMapping: Record<string, number> = {
  "주방보조": 1,
  "서빙": 2,
  "바리스타": 3,
  "캐셔": 4,
  "배달": 5,
  "주방장": 6,
  "설거지": 7,
};

export function SignupScreen({ onNavigate, onSignupSuccess }: SignupScreenProps) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    nationality: "",
    job: "",
    level: "",
    description: "", // ✅ 구체적 직무
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ 회원가입 요청
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.nickname) {
      alert("이메일, 비밀번호, 닉네임은 필수 입력 항목입니다.");
      return;
    }

    // ✅ 직무명을 숫자로 매핑 (없을 경우 기본값 1)
    const jobId = jobMapping[form.job] || 1;

    const signupData = {
      email: form.email,
      password: form.password,
      nickname: form.nickname,
      nationality: form.nationality,
      job_id: jobId,
      level_id: Number(form.level) || 1,
      description: form.description || "", // ✅ 구체적인 직무
    };

    try {
      const res = await api.post("/auth/signup", signupData);
      console.log("✅ 회원가입 성공:", res.data);
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");

      if (onSignupSuccess) onSignupSuccess(res.data);
      onNavigate("login");
    } catch (err: any) {
      console.error("❌ 회원가입 실패:", err);
      alert("회원가입 실패: " + (err.response?.data?.detail || "서버 오류가 발생했습니다."));
    }
  };

  // ✅ UI 렌더링
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <img src={K4YLogo} alt="Korean For You" className="h-16 mx-auto mb-4" />
          <p className="text-gray-600">요식업 외국인 근로자를 위한 실무 한국어</p>
        </div>

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
                    <SelectItem value="NP">네팔</SelectItem>
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
                    {Object.keys(jobMapping).map((jobName) => (
                      <SelectItem key={jobName} value={jobName}>
                        {jobName}
                      </SelectItem>
                    ))}
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

              {/* ✅ 구체적인 직무 설명 */}
              <div className="space-y-2">
                <Label htmlFor="description">구체적인 직무</Label>
                <Input
                  id="description"
                  placeholder="ex) 치킨집 서빙, 카페 바리스타"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                회원가입
              </Button>
            </form>

            <div className="text-center space-y-2 mt-4">
              <Button variant="link" onClick={() => onNavigate("login")} className="w-full">
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