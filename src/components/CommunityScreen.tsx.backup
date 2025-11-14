import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ArrowLeft, Search, Plus, Pin, MessageSquare, Eye, ThumbsUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Navigation } from "./Navigation";

interface CommunityScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: (defaultScreen: string) => void;
}

const pinnedPosts = [
  {
    id: 1,
    title: "2025년 최저시급 및 근로 조건 안내",
    category: "공지",
    author: "관리자",
    views: 1245,
    likes: 89,
    comments: 23,
    isPinned: true
  },
  {
    id: 2,
    title: "외국인 근로자 주휴수당 완벽 가이드",
    category: "생활정보",
    author: "관리자",
    views: 987,
    likes: 156,
    comments: 45,
    isPinned: true
  }
];

const posts = {
  all: [
    {
      id: 3,
      title: "손님이 화났을 때 어떻게 말해야 하나요?",
      category: "Q&A",
      author: "김민수",
      views: 234,
      likes: 12,
      comments: 8,
      time: "2시간 전"
    },
    {
      id: 4,
      title: "한국 식당에서 자주 쓰는 표현 정리해봤어요",
      category: "정보공유",
      author: "이수진",
      views: 189,
      likes: 34,
      comments: 15,
      time: "5시간 전"
    },
    {
      id: 5,
      title: "신분증 재발급 어디서 하나요?",
      category: "생활정보",
      author: "응우옌",
      views: 156,
      likes: 8,
      comments: 12,
      time: "1일 전"
    },
  ],
  qna: [
    {
      id: 3,
      title: "손님이 화났을 때 어떻게 말해야 하나요?",
      category: "Q&A",
      author: "김민수",
      views: 234,
      likes: 12,
      comments: 8,
      time: "2시간 전"
    },
  ],
  info: [
    {
      id: 4,
      title: "한국 식당에서 자주 쓰는 표현 정리해봤어요",
      category: "정보공유",
      author: "이수진",
      views: 189,
      likes: 34,
      comments: 15,
      time: "5시간 전"
    },
    {
      id: 5,
      title: "신분증 재발급 어디서 하나요?",
      category: "생활정보",
      author: "응우옌",
      views: 156,
      likes: 8,
      comments: 12,
      time: "1일 전"
    },
  ]
};

const categoryColors: { [key: string]: string } = {
  "공지": "bg-red-100 text-red-700 border-red-200",
  "Q&A": "bg-blue-100 text-blue-700 border-blue-200",
  "정보공유": "bg-green-100 text-green-700 border-green-200",
  "생활정보": "bg-purple-100 text-purple-700 border-purple-200"
};

export function CommunityScreen({ onNavigate, onBack }: CommunityScreenProps) {
  const handleBackClick = () => {
    if (onBack) {
      onBack('home');
    } else {
      onNavigate('home');
    }
  };

  const PostCard = ({ post, isPinned = false }: { post: any; isPinned?: boolean }) => (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${isPinned ? 'bg-yellow-50 border-yellow-200' : ''}`}
      onClick={() => onNavigate('postDetail')}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
              <Badge 
                variant="outline" 
                className={categoryColors[post.category] || ""}
              >
                {post.category}
              </Badge>
            </div>
            <h3 className="mb-1">{post.title}</h3>
            <div className="text-sm text-gray-600">
              {post.author} {post.time && `• ${post.time}`}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>커뮤니티</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Search & Create */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="게시글 검색..." 
              className="pl-10"
            />
          </div>
          <Button onClick={() => onNavigate('postCreate')}>
            <Plus className="w-4 h-4 mr-2" />
            글쓰기
          </Button>
        </div>

        {/* Pinned Posts */}
        <div className="space-y-3">
          <h2 className="flex items-center gap-2">
            <Pin className="w-5 h-5 text-yellow-600" />
            고정 공지
          </h2>
          {pinnedPosts.map(post => (
            <PostCard key={post.id} post={post} isPinned={true} />
          ))}
        </div>

        {/* Posts with Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="qna">Q&A</TabsTrigger>
            <TabsTrigger value="info">생활정보</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {posts.all.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>

          <TabsContent value="qna" className="space-y-3">
            {posts.qna.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>

          <TabsContent value="info" className="space-y-3">
            {posts.info.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>
        </Tabs>

        {/* Help Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="mb-2">커뮤니티 이용 안내</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 궁금한 점은 Q&A에 질문해주세요</li>
                  <li>• 유용한 정보는 정보공유에 올려주세요</li>
                  <li>• 서로 존중하는 댓글 문화를 만들어요</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}