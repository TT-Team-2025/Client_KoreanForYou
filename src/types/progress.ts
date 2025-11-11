import { BaseResponse, DateString } from "./commonTypes";

export interface UserProgress {
  progress_id: number;
  user_id: number;
  chapter_id: number;
  completion_rate: number;
  last_access_at: number;
  created_at: DateString;
}

