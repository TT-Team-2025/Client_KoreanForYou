import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ArrowLeft, Camera, LogOut, Award, BookOpen, MessageSquare, Clock, UserX } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Navigation } from "./Navigation";
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

interface MyPageScreenProps {
  onNavigate: (screen: string) => void;
}

export function MyPageScreen({ onNavigate }: MyPageScreenProps) {
  const [profileData, setProfileData] = useState({
    nickname: "홍길동",
    nationality: "vietnam",
    job: "서빙",
    jobDetail: "치킨집"
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = () => {
    // 프로필 저장 로직
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleLogout = () => {
    onNavigate('login');
  };

  const handleDeleteAccount = () => {
    // 계정 탈퇴 로직
    // 실제 구현에서는 백엔드 API 호출
    alert('계정이 삭제되었습니다. 그동안 이용해주셔서 감사합니다.');
    onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation onNavigate={onNavigate} currentScreen="mypage" />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {isSaved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            프로필이 성공적으로 저장되었습니다!
          </div>
        )}

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>프로필</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-400 text-white text-2xl">
                    홍
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                  variant="secondary"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="mb-1">홍길동</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">중급</Badge>
                  <span className="text-sm text-gray-600">Level 2</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value="hong@example.com"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input 
                  id="nickname" 
                  type="text" 
                  value={profileData.nickname}
                  onChange={(e) => setProfileData({...profileData, nickname: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">국적</Label>
                <Select 
                  value={profileData.nationality} 
                  onValueChange={(value) => setProfileData({...profileData, nationality: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                <Select 
                  value={profileData.job} 
                  onValueChange={(value) => setProfileData({...profileData, job: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="주방장">주방장</SelectItem>
                    <SelectItem value="주방 직원">주방 직원</SelectItem>
                    <SelectItem value="제빵사">제빵사</SelectItem>
                    <SelectItem value="홀 서빙">홀 서빙</SelectItem>
                    <SelectItem value="계산 담당">계산 담당</SelectItem>
                    <SelectItem value="바리스타">바리스타</SelectItem>
                    <SelectItem value="세척 담당">세척 담당</SelectItem>
                    <SelectItem value="배달원">배달원</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-detail">구체적인 직무 혹은 어디서 일하는 지 알려주세요</Label>
                <Input 
                  id="job-detail" 
                  type="text" 
                  placeholder="ex) 치킨집, GS25"
                  value={profileData.jobDetail}
                  onChange={(e) => setProfileData({...profileData, jobDetail: e.target.value})}
                />
              </div>
            </div>

            <Button className="w-full" onClick={handleSaveProfile}>프로필 저장</Button>
          </CardContent>
        </Card>

        {/* Community Activity */}
        <Card>
          <CardHeader>
            <CardTitle>커뮤니티 활동</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onNavigate('myPosts')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              내가 쓴 글
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onNavigate('myComments')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              내가 쓴 댓글
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onNavigate('passwordChange')}
            >
              비밀번호 변경
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onNavigate('languageSettings')}
            >
              언어 설정
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </Button>

        {/* Account Deletion */}
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
                <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white">
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
                      <li>레벨 및 성취 기록</li>
                    </ul>
                    <p className="pt-2">이 작업은 되돌릴 수 없습니다.</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    탈퇴하기
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </main>
    </div>
  );
}