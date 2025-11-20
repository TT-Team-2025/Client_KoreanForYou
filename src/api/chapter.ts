// 전체 챕터 조회
import apiClient from "@/api/client";
import {
    Chapter,
    GetSentence
 } from '@/types/chapters';
import type { BaseResponse } from '@/types/commonTypes';

// ==========================================================
// 📘 챕터 관련 타입
// ==========================================================
export interface ChapterCreate {
  category_id: number;
  job_id?: number;
  level_id: number;
  title: string;
  description?: string;
  is_active?: boolean;
}

// ==========================================================
// ✅ 챕터 생성 (POST /api/chapters)
// ==========================================================
export const createChapter = async (data: ChapterCreate): Promise<BaseResponse<any>> => {
  const response = await apiClient.post<BaseResponse<any>>('/chapters/', data);
  return response.data;
};

// ==========================================================
// ✅ 카테고리별 챕터 생성 (POST /api/chapters/categories)
// ==========================================================
export const createChaptersByCategory = async (job_id: number): Promise<BaseResponse<any>> => {
  const response = await apiClient.post<BaseResponse<any>>('/chapters/categories', { job_id });
  return response.data;
};

// 전체 챕터 조회
export const getMyChapters = async (): Promise<Chapter[]> => {
    const response = await apiClient.get<Chapter[]>('/chapters/')
    console.log(response.data)
    return response.data
}

export const getSentenceBySentenceId = async (sentenceId:number) : Promise<GetSentence> =>{
    const response = await apiClient.get<GetSentence>(`/sentences/${sentenceId}`);
    console.log('getSenteceBySentenceId(): ', response.data)
    return response.data
}

export const getRandomSentence = async ()=>{
    const response = await apiClient.get<GetSentence>('/sentences/random')
    console.log('랜덤 문장압니다 : ', response.data)
    return response.data
}


