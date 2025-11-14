import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ArrowLeft, Search, Plus, MessageSquare, Eye, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useGetPosts } from "@/hooks/community/usePosts";
import { PostCategory, type Post } from "@/types/community";

interface CommunityScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack?: (defaultScreen: string) => void;
}

const categoryColors: { [key: string]: string } = {
  "공지": "bg-red-100 text-red-700 border-red-200",
  "Q&A": "bg-blue-100 text-blue-700 border-blue-200",
  "정보공유": "bg-green-100 text-green-700 border-green-200",
  "생활정보": "bg-purple-100 text-purple-700 border-purple-200",
  "자유게시판": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "취업정보": "bg-indigo-100 text-indigo-700 border-indigo-200"
};

export function CommunityScreen({ onNavigate, onBack }: CommunityScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // React Query로 게시글 목록 가져오기
  const { data: postsData, isLoading, error } = useGetPosts();

  const handleBackClick = () => {
    if (onBack) {
      onBack('home');
    } else {
      onNavigate('home');
    }
  };

  // 카테고리별 필터링
  const filteredPosts = useMemo(() => {
    if (!postsData?.posts) return [];

    let posts = postsData.posts;

    // 검색어 필터링
    if (searchQuery) {
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 카테고리 필터링
    if (selectedCategory !== "all") {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    return posts;
  }, [postsData?.posts, searchQuery, selectedCategory]);

  const PostCard = ({ post }: { post: Post }) => (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onNavigate('postDetail', { postId: post.post_id })}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={categoryColors[post.category] || ""}
              >
                {post.category}
              </Badge>
            </div>
            <h3 className="mb-1 font-semibold">{post.title}</h3>
            <div className="text-sm text-gray-600">
              {new Date(post.created_at).toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.view_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>댓글</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()}>
              새로고침
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">커뮤니티</h1>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => onNavigate('postCreate')}>
            <Plus className="w-4 h-4 mr-2" />
            글쓰기
          </Button>
        </div>

        {/* Posts with Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value={PostCategory.QNA}>Q&A</TabsTrigger>
            <TabsTrigger value={PostCategory.INFO_SHARE}>정보공유</TabsTrigger>
            <TabsTrigger value={PostCategory.FREE}>자유게시판</TabsTrigger>
            <TabsTrigger value={PostCategory.JOB_INFO}>취업정보</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard key={post.post_id} post={post} />
              ))
            ) : (
              <Card className="p-12">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>게시글이 없습니다.</p>
                  <p className="text-sm mt-1">첫 번째 게시글을 작성해보세요!</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Help Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="font-bold mb-2">커뮤니티 이용 안내</h3>
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
