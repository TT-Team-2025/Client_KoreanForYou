import { useMutation } from "@tanstack/react-query";
import api from "@/api/axiosInstance";

interface ChapterFeedbackResponse {
  feedback_id: number;
  user_id: number;
  chapter_id: number;
  total_score?: number;
  pronunciation_score?: number;
  accuracy_score?: number;
  completion_time?: number; // INTEGER (초 단위)
  total_sentences: number;
  completed_sentences: number;
  summary_feedback?: string;
  weaknesses?: string[];
  total_time?: number;
  created_at: string;
}

interface GenerateChapterFeedbackRequest {
  chapterId: number;
  completionTime?: number; // 초 단위 (optional)
}

const generateChapterFeedback = async (
  params: GenerateChapterFeedbackRequest
): Promise<ChapterFeedbackResponse> => {
  // completion_time을 보내지 않고 빈 객체로 요청
  // 백엔드가 자체적으로 처리하도록
  const response = await api.post<ChapterFeedbackResponse>(
    `/feedback/chapters/${params.chapterId}`,
    {} // 빈 객체
  );
  return response.data;
};

export const useGenerateChapterFeedback = () => {
  return useMutation({
    mutationFn: (params: GenerateChapterFeedbackRequest) => generateChapterFeedback(params),
  });
};
