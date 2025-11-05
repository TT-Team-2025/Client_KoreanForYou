// 전체 챕터 조회
import apiClient from "@/api/client";
import { Chapter } from '@/types/chapters';


// 전체 챕터 조회
export const getMyChapters = async (): Promise<Chapter[]> => {
    const response = await apiClient.get<Chapter[]>('/chapters/')
    console.log(response.data)
    return response.data
}

