import { useQuery } from "@tanstack/react-query";
import api from "@/api/axiosInstance";

interface ChapterFeedbackBrief {
  feedback_id: number;
  chapter_id: number;
  chapter_title: string;
  completed_sentences: number;
  total_sentences: number;
  total_score: number;
  completed_date: string;
}

interface RecentChapterFeedbacksResponse {
  success: boolean;
  message: string;
  data: ChapterFeedbackBrief[];
}

const fetchRecentChapterFeedbacks = async (limit: number = 10): Promise<ChapterFeedbackBrief[]> => {
  const response = await api.get<RecentChapterFeedbacksResponse>(
    `/stats/chapters/recent`,
    { params: { limit } }
  );
  console.log('최근 챕터 학습 기록 : ', response.data)
  return response.data.data || [];
};

export const useRecentChapterFeedbacks = (limit: number = 10) => {
  return useQuery<ChapterFeedbackBrief[], Error>({
    queryKey: ["recentChapterFeedbacks", limit],
    queryFn: () => fetchRecentChapterFeedbacks(limit),
    staleTime: 1000 * 60 * 5, // 5분
  });
};
