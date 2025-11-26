import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, MessageSquare, Eye } from "lucide-react";
import { useUserPost } from "@/hooks/users/useUserPost";
import { PostCategory } from "@/types/community";

interface MyPostsScreenProps {
  onNavigate: (screen: string) => void;
}

export function MyPostsScreen({ onNavigate }: MyPostsScreenProps) {
  const { data, isLoading, error } = useUserPost();

  const myPosts = data?.posts || [];

  const getCategoryColor = (category: PostCategory) => {
    switch (category) {
      case PostCategory.INFO_SHARE:
        return "bg-blue-100 text-blue-700";
      case PostCategory.QNA:
        return "bg-orange-100 text-orange-700";
      case PostCategory.FREE:
        return "bg-green-100 text-green-700";
      case PostCategory.JOB_INFO:
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
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
        <p className="text-red-600">게시글을 불러오는데 실패했습니다.</p>
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
              key={post.post_id}
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
                      <span>{formatDate(post.created_at)}</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{post.view_count}</span>
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
