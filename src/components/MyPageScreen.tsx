// ========================================
// 📄 MyPageScreen.tsx (2025-11-06 완전 주석 포함 버전)
// 상태: ✅ 서버 description 필드 연동 완료 + 전체 UI 정상 표시
// ========================================

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Camera, LogOut, UserX, MessageSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Navigation } from "./Navigation";
import api from "../api/axiosInstance";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

// -----------------------------
// 🧭 코드 → 이름 매핑 함수
// -----------------------------
const mapNationalityCodeToName = (code: string) => {
  const map: Record<string, string> = {
    KR: "korea",
    VN: "vietnam",
    PH: "philippines",
    TH: "thailand",
    NP: "nepal",
    OTHER: "other",
  };
  return map[code] || "";
};

const mapJobIdToName = (id: number) => {
  const jobMap: Record<number, string> = {
    1: "주방보조",
    2: "서빙",
    3: "바리스타",
    4: "캐셔",
    5: "배달",
    6: "주방장",
    7: "세척 담당",
  };
  return jobMap[id] || "";
};

// -----------------------------
// 🧱 메인 컴포넌트
// -----------------------------
interface MyPageScreenProps {
  onNavigate: (screen: string) => void;
}

export function MyPageScreen({ onNavigate }: MyPageScreenProps) {
  // ✅ 프로필 상태
  const [profileData, setProfileData] = useState({
    nickname: "",
    nationality: "",
    job: "",
    jobDetail: "",
  });
  const [isSaved, setIsSaved] = useState(false);

  // ✅ 프로필 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      console.log("📦 Access Token:", localStorage.getItem("access_token"));
      try {
        const res = await api.get("/users/");
        console.log("📥 서버 응답:", res.data);

        setProfileData({
          nickname: res.data.nickname || "",
          nationality: mapNationalityCodeToName(res.data.nationality) || "",
          job: mapJobIdToName(res.data.job_id) || "",
          jobDetail: res.data.description || "", // ✅ 서버 description 연동
        });
      } catch (err) {
        console.error("❌ 프로필 불러오기 실패:", err);
      }
    };
    fetchProfile();
  }, []);

  // ✅ 프로필 저장
  const handleSaveProfile = async () => {
    try {
      await api.put("/users/", {
        nickname: profileData.nickname,
        nationality: profileData.nationality.toUpperCase(),
        job_name: profileData.job,
        description: profileData.jobDetail, // ✅ 서버 필드명과 일치
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error("❌ 프로필 저장 실패:", err);
      alert("프로필 저장 중 오류가 발생했습니다.");
    }
  };

  // ✅ 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    onNavigate("login");
  };

  // ✅ 회원 탈퇴 (임시 알림)
  const handleDeleteAccount = () => {
    alert("계정이 삭제되었습니다. 그동안 이용해주셔서 감사합니다.");
    onNavigate("login");
  };

  // -----------------------------
  // 🖼️ 렌더링
  // -----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* 상단 네비게이션 */}
      <Navigation onNavigate={onNavigate} currentScreen="mypage" />

      {/* 메인 내용 */}
      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-white shadow-md rounded-2xl mt-6 mb-20">
        {/* 저장 완료 알림 */}
        {isSaved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            프로필이 성공적으로 저장되었습니다!
          </div>
        )}

        {/* 프로필 카드 */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>프로필</CardTitle>
            <CardDescription>회원님의 기본 정보를 관리할 수 있습니다.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 프로필 이미지 / 닉네임 */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-500 text-white text-2xl">
                    {profileData.nickname ? profileData.nickname[0] : "K"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 bg-white border border-gray-300"
                  variant="ghost"
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </Button>
              </div>

              <div>
                <h2 className="text-lg font-semibold">{profileData.nickname || "닉네임 미등록"}</h2>
                <Badge variant="secondary" className="mt-1">
                  회원
                </Badge>
              </div>
            </div>

            {/* 입력 폼 */}
            <div className="grid gap-4">
              {/* 닉네임 */}
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  className="bg-white border-gray-200"
                  value={profileData.nickname}
                  onChange={(e) => setProfileData({ ...profileData, nickname: e.target.value })}
                />
              </div>

              {/* 국적 */}
              <div className="space-y-2">
                <Label htmlFor="nationality">국적</Label>
                <Select
                  value={profileData.nationality}
                  onValueChange={(value) => setProfileData({ ...profileData, nationality: value })}
                >
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="국적을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-lg border border-gray-200">
                    <SelectItem value="korea">대한민국</SelectItem>
                    <SelectItem value="vietnam">베트남</SelectItem>
                    <SelectItem value="philippines">필리핀</SelectItem>
                    <SelectItem value="thailand">태국</SelectItem>
                    <SelectItem value="nepal">네팔</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 직무 */}
              <div className="space-y-2">
                <Label htmlFor="job">직무</Label>
                <Select
                  value={profileData.job}
                  onValueChange={(value) => setProfileData({ ...profileData, job: value })}
                >
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="직무를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-lg border border-gray-200">
                    <SelectItem value="주방보조">주방보조</SelectItem>
                    <SelectItem value="서빙">서빙</SelectItem>
                    <SelectItem value="바리스타">바리스타</SelectItem>
                    <SelectItem value="캐셔">캐셔</SelectItem>
                    <SelectItem value="배달">배달</SelectItem>
                    <SelectItem value="주방장">주방장</SelectItem>
                    <SelectItem value="세척 담당">세척 담당</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 직무 상세 */}
              <div className="space-y-2">
                <Label htmlFor="job-detail">직무 상세</Label>
                <Input
                  id="job-detail"
                  type="text"
                  className="bg-white border-gray-200"
                  placeholder="ex) 치킨집, GS25"
                  value={profileData.jobDetail}
                  onChange={(e) => setProfileData({ ...profileData, jobDetail: e.target.value })}
                />
              </div>
            </div>

            {/* 저장 버튼 */}
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              onClick={handleSaveProfile}
            >
              프로필 저장
            </Button>
          </CardContent>
        </Card>

        {/* 커뮤니티 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>커뮤니티 활동</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("myPosts")}>
              <MessageSquare className="w-4 h-4 mr-2" />
              내가 쓴 글
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("myComments")}>
              <MessageSquare className="w-4 h-4 mr-2" />
              내가 쓴 댓글
            </Button>
          </CardContent>
        </Card>

        {/* 로그아웃 */}
        <Button
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </Button>

        {/* 계정 삭제 */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">계정 삭제</CardTitle>
            <CardDescription>
              계정을 삭제하면 모든 학습 기록과 데이터가 영구적으로 삭제됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  <UserX className="w-4 h-4 mr-2" />
                  회원 탈퇴
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말로 탈퇴하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>계정을 삭제하면 다음 정보가 모두 삭제됩니다:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>모든 학습 기록 및 진행 상황</li>
                      <li>작성한 게시글 및 댓글</li>
                      <li>프로필 정보</li>
                    </ul>
                    <p className="pt-2 text-red-600">이 작업은 되돌릴 수 없습니다.</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                    탈퇴하기
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
