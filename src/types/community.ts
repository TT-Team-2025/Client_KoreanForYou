import { BaseResponse, DateString } from "./commonTypes";

export interface Post {
  post_id: number;
  user_id: number;
  title: string;
  content: string;
  category: string;
  view_count: number;
  created_at: DateString;
  updated_at: DateString;
}

export interface Reply {
  reply_id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: DateString;
  updated_at: DateString;
}