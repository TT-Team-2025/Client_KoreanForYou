import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ArrowLeft, Eye, ThumbsUp, MessageSquare, Share2 } from "lucide-react";

interface PostDetailScreenProps {
  onNavigate: (screen: string) => void;
}

export function PostDetailScreen({ onNavigate }: PostDetailScreenProps) {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

  const post = {
    title: "손님이 화났을 때 어떻게 말해야 하나요?",
    category: "Q&A",
    author: "김민수",
    authorLevel: "중급",
    content: `안녕하세요. 저는 한식당에서 일한 지 3개월 됐어요.

어제 손님이 음식이 늦게 나온다고 화를 내셨는데, 제가 뭐라고 말해야 할지 몰라서 당황했어요.

이런 상황에서 어떻게 말하는 게 좋을까요? 선배님들의 조언 부탁드립니다.`,
    time: "2시간 전",
    views: 234,
    likes: 12,
    comments: 8
  };

  const replies = [
    {
      id: 1,
      author: "박서연",
      authorLevel: "고급",
      content: "저도 비슷한 경험 있어요. 이렇게 말하면 좋아요:\n\n\"죄송합니다. 주방이 바빠서 늦어졌습니다. 빨리 나오도록 확인해드릴게요.\"\n\n그리고 매니저나 주방에 빨리 알려주는 게 중요해요!",
      time: "1시간 전",
      likes: 8
    },
    {
      id: 2,
      author: "이수진",
      authorLevel: "중급",
      content: "저는 \"정말 죄송합니다. 제가 바로 확인하고 오겠습니다.\" 라고 말하고 주방에 가서 확인했어요. 손님한테 다시 가서 \"5분 후에 나옵니다\"라고 정확한 시간을 알려드리면 조금 안심하시더라고요.",
      time: "30분 전",
      likes: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('community')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>게시글</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Post Content */}
        <Card>
          <CardHeader>
            <div className="space-y-3">
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                {post.category}
              </Badge>
              <h1>{post.title}</h1>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {post.author[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{post.author}</span>
                    <Badge variant="secondary" className="text-xs">
                      {post.authorLevel}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">{post.time}</div>
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
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLiked(!liked)}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {liked ? post.likes + 1 : post.likes}
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
            <h2>댓글 {replies.length}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {replies.map((reply) => (
              <div key={reply.id} className="pb-4 border-b last:border-0">
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-green-500 text-white">
                      {reply.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{reply.author}</span>
                      <Badge variant="secondary" className="text-xs">
                        {reply.authorLevel}
                      </Badge>
                      <span className="text-xs text-gray-500">{reply.time}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap mb-2">
                      {reply.content}
                    </p>
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {reply.likes}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
              <Button disabled={!comment.trim()}>
                댓글 작성
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
