// 전체 챕터 조회
import apiClient from "@/api/client";
import { 
    Chapter,
    GetSentence
 } from '@/types/chapters';


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


