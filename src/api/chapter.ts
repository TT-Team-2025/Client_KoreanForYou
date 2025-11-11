// 전체 챕터 조회
import apiClient from "@/api/client";
import { 
    Chapter,
    GetSentence
 } from '@/types/chapters';
import api from "./axiosInstance";


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


