import apiClient from "./client";
import { UserProgress } from "@/types/progress";

export const getMyProgress = async (user_id:number): Promise<UserProgress> =>{
    const response = await apiClient.get<UserProgress>(
      `/progress/user/${user_id}`
    );
    console.log('getMyProgressData : ', response.data)
    return response.data
}