import { useQuery } from "@tanstack/react-query";
import { Chapter } from "@/types/chapters";
import { getMyChapters } from "@/api/chapter";

export const useChapters = () => {
  const chapterQuery = useQuery<Chapter[], Error>({
    queryKey: ["chapters"],
    queryFn: getMyChapters,
  });
  return chapterQuery;
};
