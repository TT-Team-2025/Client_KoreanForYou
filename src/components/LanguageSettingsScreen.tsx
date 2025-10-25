import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { ArrowLeft, Check } from "lucide-react";

interface LanguageSettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export function LanguageSettingsScreen({ onNavigate }: LanguageSettingsScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("ko");
  const [success, setSuccess] = useState(false);

  const languages = [
    { code: "ko", name: "한국어", native: "한국어" },
    { code: "en", name: "영어", native: "English" },
    { code: "vi", name: "베트남어", native: "Tiếng Việt" },
    { code: "th", name: "태국어", native: "ภาษาไทย" },
    { code: "ne", name: "네팔어", native: "नेपाली" },
    { code: "tl", name: "타갈로그어", native: "Tagalog" },
  ];

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('mypage')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">언어 설정</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            언어 설정이 저장되었습니다!
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>앱 언어 선택</CardTitle>
            <CardDescription>
              앱에서 사용할 언어를 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedLanguage === lang.code
                        ? "bg-blue-50 border-blue-300"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedLanguage(lang.code)}
                  >
                    <RadioGroupItem value={lang.code} id={lang.code} />
                    <Label
                      htmlFor={lang.code}
                      className="flex-1 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{lang.name}</div>
                        <div className="text-sm text-gray-600">{lang.native}</div>
                      </div>
                      {selectedLanguage === lang.code && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="mb-2">언어 설정 안내</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 학습 콘텐츠는 항상 한국어로 제공됩니다</li>
                  <li>• 선택한 언어로 앱의 메뉴와 설명이 표시됩니다</li>
                  <li>• 언제든지 다시 변경할 수 있습니다</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onNavigate('mypage')}
          >
            취소
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            저장하기
          </Button>
        </div>
      </main>
    </div>
  );
}
