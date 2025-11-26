import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useUserReply } from "@/hooks/users/useUserReply";

interface MyCommentsScreenProps {
  onNavigate: (screen: string) => void;
}

export function MyCommentsScreen({ onNavigate }: MyCommentsScreenProps) {
  const { data, isLoading, error } = useUserReply();

  const myComments = data?.replies || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">댓글을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

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
          myComments.map((reply) => (
            <Card
              key={reply.reply_id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate('postDetail')}
            >
              <CardContent className="p-4">
                {/* Reply Info */}
                <div className="mb-2 pb-2 border-b">
                  <Badge className="text-xs bg-gray-100 text-gray-700">
                    게시글 ID: {reply.post_id}
                  </Badge>
                </div>

                {/* My Comment */}
                <div>
                  <p className="text-sm mb-3">
                    {reply.content}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatDate(reply.created_at)}</span>
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
