import { useQuery } from "@tanstack/react-query";
import { getMyProgress } from "@/api/progress";
import { UserProgress } from "@/types/progress";
import { use } from "react";


export const useUserProgress = (userId:number)=>{
    return useQuery<UserProgress,Error>({
        queryKey: ['userProgress', userId],
        queryFn: ()=> getMyProgress(userId),
        enabled: !! userId && userId > 0,
    })
}
