/**
 * ==========================================================
 * 📁 파일명: LoginScreen.tsx
 * 📜 역할: 로그인 화면 (FastAPI OAuth2 Password 기반 인증)
 * ==========================================================
 *
 * ✅ 핵심 기능 요약
 * 1️⃣ 사용자 이메일/비밀번호 입력 후 /auth/login 호출
 * 2️⃣ access_token, refresh_token을 localStorage에 저장
 * 3️⃣ 로그인 성공 시 홈 화면으로 이동
 *
 * ⚙️ 참고
 * - FastAPI OAuth2 Password 방식은 form-data로 전송해야 함
 * - axiosInstance.ts가 토큰 자동 관리(재발급/헤더추가)를 담당
 * ==========================================================
 */

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import K4YLogo from "../assets/K4Y_logo.png";
import { useLogin } from "@/hooks/auth/useLogin";

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  /**
   * ✅ 상태 관리
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * ✅ React Query 로그인 hook
   */
  const loginMutation = useLogin();

  /**
   * ✅ 로그인 폼 전송 이벤트
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          console.log("✅ 로그인 성공");
          alert("로그인 성공! 환영합니다 👋");
          onNavigate("home");
        },
        onError: (error: any) => {
          console.error("❌ 로그인 실패:", error);
          alert("로그인 실패: 이메일 또는 비밀번호를 확인해주세요.");
        },
      }
    );
  };

  // ================================
  // ✅ UI 렌더링
  // ================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-4">
      <div className="w-full max-w-md">
        {/* 로고 섹션 */}
        <div className="text-center mb-8">
          <img
            src={K4YLogo}
            alt="Korean For You"
            className="h-16 mx-auto mb-4"
          />
          <p className="text-gray-600">
            요식업 외국인 근로자를 위한 실무 한국어
          </p>
        </div>

        {/* 로그인 카드 */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>
              계정에 로그인하여 학습을 계속하세요
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* 로그인 폼 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이메일 */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            {/* 하단 네비게이션 */}
            <div className="text-center space-y-2 mt-4">
              <Button
                variant="link"
                onClick={() => onNavigate("signup")}
                className="w-full"
              >
                계정이 없으신가요? 회원가입
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
