import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, MessageSquare, Eye, ThumbsUp } from "lucide-react";

interface MyPostsScreenProps {
  onNavigate: (screen: string) => void;
}

export function MyPostsScreen({ onNavigate }: MyPostsScreenProps) {
  // Mock data - 내가 쓴 글
  const myPosts = [
    {
      id: 1,
      title: "서빙할 때 유용한 표현 공유합니다",
      category: "팁공유",
      content: "손님이 물을 달라고 하실 때 '물 가져다 드릴게요'라고 하면 돼요...",
      createdAt: "2025-10-15",
      views: 245,
      likes: 18,
      comments: 12
    },
    {
      id: 2,
      title: "주방장님과 대화하는 법",
      category: "질문",
      content: "주방장님이 빨리 하라고 하실 때 뭐라고 대답해야 할까요?",
      createdAt: "2025-10-12",
      views: 189,
      likes: 15,
      comments: 8
    },
    {
      id: 3,
      title: "한국 음식 이름 외우기 팁",
      category: "팁공유",
      content: "비빔밥, 김치찌개, 된장찌개... 처음엔 너무 어려웠는데 이렇게 외웠어요",
      createdAt: "2025-10-08",
      views: 412,
      likes: 35,
      comments: 20
    },
    {
      id: 4,
      title: "레벨테스트 준비 어떻게 하셨나요?",
      category: "질문",
      content: "다음주에 레벨테스트를 봐야 하는데 어떻게 준비하면 좋을까요?",
      createdAt: "2025-10-05",
      views: 156,
      likes: 9,
      comments: 6
    },
    {
      id: 5,
      title: "손님들이 자주 쓰는 표현 모음",
      category: "팁공유",
      content: "3개월 서빙하면서 손님들이 자주 하시는 말 정리해봤어요",
      createdAt: "2025-10-01",
      views: 523,
      likes: 42,
      comments: 28
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "팁공유":
        return "bg-blue-100 text-blue-700";
      case "질문":
        return "bg-orange-100 text-orange-700";
      case "일상":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('mypage')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>내가 쓴 글</h1>
            <p className="text-sm text-gray-600">총 {myPosts.length}개의 게시글</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-4 space-y-3">
        {myPosts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">작성한 게시글이 없습니다</p>
              <Button onClick={() => onNavigate('community')}>
                커뮤니티 둘러보기
              </Button>
            </CardContent>
          </Card>
        ) : (
          myPosts.map((post) => (
            <Card
              key={post.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate('postDetail')}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Category Badge */}
                    <Badge className={`${getCategoryColor(post.category)} mb-2`}>
                      {post.category}
                    </Badge>

                    {/* Title */}
                    <h3 className="mb-2 line-clamp-1">
                      {post.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {post.content}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{post.createdAt}</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
