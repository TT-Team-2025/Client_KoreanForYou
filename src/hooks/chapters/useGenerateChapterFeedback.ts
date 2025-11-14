import { useMutation } from "@tanstack/react-query";
import api from "@/api/axiosInstance";

interface ChapterFeedbackResponse {
  feedback_id: number;
  user_id: number;
  chapter_id: number;
  total_score?: number;
  pronunciation_score?: number;
  accuracy_score?: number;
  completion_time?: string;
  total_sentences: number;
  completed_sentences: number;
  summary_feedback?: string;
  weaknesses?: string[];
  total_time?: number;
  created_at: string;
}

const generateChapterFeedback = async (chapterId: number): Promise<ChapterFeedbackResponse> => {
  const response = await api.post<ChapterFeedbackResponse>(`/feedback/chapters/${chapterId}`);
  return response.data;
};

export const useGenerateChapterFeedback = () => {
  return useMutation({
    mutationFn: (chapterId: number) => generateChapterFeedback(chapterId),
  });
};
