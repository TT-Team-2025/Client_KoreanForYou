import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react";

interface MyCommentsScreenProps {
  onNavigate: (screen: string) => void;
}

export function MyCommentsScreen({ onNavigate }: MyCommentsScreenProps) {
  // Mock data - 내가 쓴 댓글
  const myComments = [
    {
      id: 1,
      postTitle: "서빙할 때 유용한 표현 공유합니다",
      postCategory: "팁공유",
      content: "저도 이 표현 자주 써요! 정말 유용하네요. 감사합니다 👍",
      createdAt: "2025-10-15 14:30",
      likes: 5
    },
    {
      id: 2,
      postTitle: "주방장님과 대화하는 법",
      postCategory: "질문",
      content: "'네, 알겠습니다' 또는 '바로 하겠습니다'라고 하시면 돼요. 저는 처음에 긴장해서 말이 안 나왔는데, 자주 쓰다보니 익숙해졌어요.",
      createdAt: "2025-10-14 09:15",
      likes: 12
    },
    {
      id: 3,
      postTitle: "한국어 발음이 너무 어려워요",
      postCategory: "질문",
      content: "저도 처음엔 그랬어요. 이 앱의 발음 연습 기능 써보세요. 많이 도움됐어요!",
      createdAt: "2025-10-13 18:45",
      likes: 8
    },
    {
      id: 4,
      postTitle: "레벨테스트 준비 어떻게 하셨나요?",
      postCategory: "질문",
      content: "매일 30분씩 문장 학습하고, AI 말하기 연습 했어요. 2주 정도 준비했더니 중급 나왔습니다.",
      createdAt: "2025-10-12 16:20",
      likes: 15
    },
    {
      id: 5,
      postTitle: "손님들이 자주 쓰는 표현 모음",
      postCategory: "팁공유",
      content: "완전 유용한 정보네요! 저장했습니다. 내일부터 바로 써볼게요!",
      createdAt: "2025-10-11 11:30",
      likes: 3
    },
    {
      id: 6,
      postTitle: "처음 일 시작하는데 조언 부탁드려요",
      postCategory: "질문",
      content: "처음엔 누구나 긴장돼요. 모르는 건 바로 물어보시고, 메모하면서 배우세요. 화이팅!",
      createdAt: "2025-10-10 20:15",
      likes: 10
    },
    {
      id: 7,
      postTitle: "바리스타 직무 한국어 표현",
      postCategory: "팁공유",
      content: "저도 바리스타인데 이 표현들 정말 매일 써요. 공유해주셔서 감사합니다!",
      createdAt: "2025-10-09 13:40",
      likes: 6
    },
    {
      id: 8,
      postTitle: "커뮤니티 활동 이벤트 안내",
      postCategory: "공지",
      content: "좋은 이벤트네요! 참여하고 싶어요 😊",
      createdAt: "2025-10-08 10:00",
      likes: 2
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
      case "공지":
        return "bg-purple-100 text-purple-700";
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
            <h1>내가 쓴 댓글</h1>
            <p className="text-sm text-gray-600">총 {myComments.length}개의 댓글</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-4 space-y-3">
        {myComments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">작성한 댓글이 없습니다</p>
              <Button onClick={() => onNavigate('community')}>
                커뮤니티 둘러보기
              </Button>
            </CardContent>
          </Card>
        ) : (
          myComments.map((comment) => (
            <Card
              key={comment.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate('postDetail')}
            >
              <CardContent className="p-4">
                {/* Original Post Info */}
                <div className="mb-3 pb-3 border-b">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`${getCategoryColor(comment.postCategory)} text-xs`}>
                      {comment.postCategory}
                    </Badge>
                    <span className="text-sm text-gray-600">원글</span>
                  </div>
                  <p className="text-sm line-clamp-1">
                    {comment.postTitle}
                  </p>
                </div>

                {/* My Comment */}
                <div>
                  <p className="text-sm mb-3">
                    {comment.content}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{comment.createdAt}</span>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{comment.likes}</span>
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
