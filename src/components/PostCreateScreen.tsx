import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCreatePost } from "@/hooks/community/useCreatePost";
import { PostCategory } from "@/types/community";
import { toast } from "sonner";

interface PostCreateScreenProps {
  onNavigate: (screen: string) => void;
}

export function PostCreateScreen({ onNavigate }: PostCreateScreenProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PostCategory | "">("");
  const [content, setContent] = useState("");

  const createPostMutation = useCreatePost();

  const handleSubmit = () => {
    if (!title || !category || !content) {
      toast.error("모든 항목을 입력해주세요");
      return;
    }

    createPostMutation.mutate(
      {
        title,
        category: category as PostCategory,
        content
      },
      {
        onSuccess: () => {
          toast.success("게시글이 작성되었습니다");
          onNavigate('community');
        },
        onError: (error: any) => {
          toast.error("게시글 작성 실패: " + error.message);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('community')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">글쓰기</h1>
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
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as PostCategory)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PostCategory.QNA}>Q&A</SelectItem>
                  <SelectItem value={PostCategory.INFO_SHARE}>정보공유</SelectItem>
                  <SelectItem value={PostCategory.FREE}>자유게시판</SelectItem>
                  <SelectItem value={PostCategory.JOB_INFO}>취업정보</SelectItem>
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
                maxLength={100}
              />
              <p className="text-xs text-gray-500">{title.length}/100</p>
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
              <h3 className="font-bold mb-2">작성 가이드</h3>
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
                disabled={createPostMutation.isPending}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={!title || !category || !content || createPostMutation.isPending}
              >
                {createPostMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    작성 중...
                  </>
                ) : (
                  '작성 완료'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
