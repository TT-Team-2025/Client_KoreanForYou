import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft } from "lucide-react";

interface PostCreateScreenProps {
  onNavigate: (screen: string) => void;
}

export function PostCreateScreen({ onNavigate }: PostCreateScreenProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (title && category && content) {
      onNavigate('community');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('community')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>글쓰기</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>새 게시글 작성</CardTitle>
            <CardDescription>
              커뮤니티에 궁금한 점을 질문하거나 유용한 정보를 공유해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qna">Q&A</SelectItem>
                  <SelectItem value="info">정보공유</SelectItem>
                  <SelectItem value="life">생활정보</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                placeholder="내용을 입력하세요&#10;&#10;예시:&#10;- 궁금한 점을 자세히 설명해주세요&#10;- 도움이 될 만한 정보를 공유해주세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="mb-2">작성 가이드</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 존중하는 언어를 사용해주세요</li>
                <li>• 질문은 구체적으로 작성하면 더 좋은 답변을 받을 수 있어요</li>
                <li>• 개인정보는 절대 공유하지 마세요</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onNavigate('community')}
              >
                취소
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSubmit}
                disabled={!title || !category || !content}
              >
                작성 완료
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
