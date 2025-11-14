import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ArrowLeft, Eye, ThumbsUp, MessageSquare, Share2, Loader2 } from "lucide-react";
import { useGetPost } from "@/hooks/community/usePost";
import { useGetReplies } from "@/hooks/community/useReply";
import { useCreateReply } from "@/hooks/community/useCreateReply";
import { toast } from "sonner";

interface PostDetailScreenProps {
  onNavigate: (screen: string) => void;
  postId?: number;
}

const categoryColors: { [key: string]: string } = {
  "Q&A": "bg-blue-100 text-blue-700 border-blue-200",
  "정보공유": "bg-green-100 text-green-700 border-green-200",
  "자유게시판": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "취업정보": "bg-indigo-100 text-indigo-700 border-indigo-200"
};

export function PostDetailScreen({ onNavigate, postId = 1 }: PostDetailScreenProps) {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

  // React Query hooks
  const { data: post, isLoading: postLoading, error: postError } = useGetPost(postId);
  const { data: repliesData, isLoading: repliesLoading } = useGetReplies(postId);
  const createReplyMutation = useCreateReply();

  const replies = repliesData?.replies || [];

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;

    createReplyMutation.mutate(
      {
        postId,
        data: { content: comment }
      },
      {
        onSuccess: () => {
          toast.success("댓글이 작성되었습니다");
          setComment("");
        },
        onError: (error: any) => {
          toast.error("댓글 작성 실패: " + error.message);
        }
      }
    );
  };

  if (postError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-4">{postError.message}</p>
            <Button onClick={() => onNavigate('community')}>
              목록으로 돌아가기
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">게시글을 찾을 수 없습니다</h2>
            <Button onClick={() => onNavigate('community')}>
              목록으로 돌아가기
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('community')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">게시글</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Post Content */}
        <Card>
          <CardHeader>
            <div className="space-y-3">
              <Badge variant="outline" className={categoryColors[post.category] || ""}>
                {post.category}
              </Badge>
              <h1 className="text-2xl font-bold">{post.title}</h1>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-500 text-white">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">
                    {new Date(post.created_at).toLocaleString('ko-KR')}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="whitespace-pre-wrap text-gray-700">
              {post.content}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.view_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{repliesLoading ? '...' : replies.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLiked(!liked)}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  좋아요
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  공유
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold">
              댓글 {repliesLoading ? '...' : replies.length}
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {repliesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : replies.length > 0 ? (
              replies.map((reply) => (
                <div key={reply.reply_id} className="pb-4 border-b last:border-0">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-green-500 text-white">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">
                          {new Date(reply.created_at).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap mb-2">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>첫 번째 댓글을 작성해보세요!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comment Input */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Textarea
              placeholder="댓글을 입력하세요..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end">
              <Button
                disabled={!comment.trim() || createReplyMutation.isPending}
                onClick={handleCommentSubmit}
              >
                {createReplyMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    작성 중...
                  </>
                ) : (
                  '댓글 작성'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
