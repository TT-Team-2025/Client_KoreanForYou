/**
 * ==========================================================
 * 📁 파일명: SignupScreen.tsx
 * 📜 역할: 회원가입 화면 (백엔드 /auth/signup API 연동)
 * ==========================================================
 *
 * ✅ 핵심 기능 요약
 * 1️⃣ 사용자로부터 이메일, 비밀번호, 닉네임, 국적, 직무, 레벨 입력받기
 * 2️⃣ 입력값을 FastAPI 백엔드의 /auth/signup 엔드포인트로 전송
 * 3️⃣ 성공 시 → "회원가입 성공" 알림 후 로그인 페이지로 이동
 *
 * ⚙️ 주의: 로그인 기능은 LoginScreen에서 수행
 * - 회원가입 후 로그인하려면 로그인 페이지로 이동해 로그인해야 함
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

import api from "../api/axiosInstance"; // ✅ 공통 Axios 인스턴스 import

import K4YLogo from "../assets/K4Y_logo.png";

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
  onSignupSuccess?: (userData: any) => void;
}

export function SignupScreen({ onNavigate, onSignupSuccess }: SignupScreenProps) {
  /**
   * ✅ 입력 상태 관리
   * - 각 input/select 값들을 form 객체에 저장
   */
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    nationality: "",
    job: "",
    level: "",
  });

  /**
   * ✅ 상태 업데이트 핸들러
   * - input/select 변경 시 해당 key에 value를 반영
   */
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * ✅ 회원가입 요청 이벤트
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수값 확인
    if (!form.email || !form.password || !form.nickname) {
      alert("이메일, 비밀번호, 닉네임은 필수 입력 항목입니다.");
      return;
    }

    // 백엔드 스키마에 맞게 필드 변환
    const signupData = {
      email: form.email,
      password: form.password,
      nickname: form.nickname,
      nationality: form.nationality,
      job_id: Number(form.job) || 1, // 선택 안 했을 경우 기본값 1
      level_id: Number(form.level) || 1, // 선택 안 했을 경우 기본값 1
    };

    try {
      // ✅ 회원가입 API 요청
      const res = await api.post("/auth/signup", signupData);
      console.log("✅ 회원가입 성공:", res.data);

      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");

      // ✅ 후속 처리 (onSignupSuccess 콜백 + 페이지 이동)
      if (onSignupSuccess) onSignupSuccess(res.data);
      onNavigate("login");
    } catch (err: any) {
      console.error("❌ 회원가입 실패:", err);
      alert(
        "회원가입 실패: " +
          (err.response?.data?.detail || "서버 통신 중 오류가 발생했습니다.")
      );
    }
  };

  // ================================
  // ✅ 화면(UI)
  // ================================
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
                    <SelectItem value="1">주방보조</SelectItem>
                    <SelectItem value="2">서빙</SelectItem>
                    <SelectItem value="3">바리스타</SelectItem>
                    <SelectItem value="4">캐셔</SelectItem>
                    <SelectItem value="5">배달</SelectItem>
                    <SelectItem value="6">주방장</SelectItem>
                    <SelectItem value="7">설거지</SelectItem>
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
