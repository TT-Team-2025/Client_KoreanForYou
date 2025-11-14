import { BaseResponse, DateString } from "./commonTypes";

export enum PostCategory {
  QNA = "Q&A",
  INFO_SHARE = "정보공유",
  FREE = "자유게시판",
  JOB_INFO = "취업정보",
}

export interface Post {
  post_id: number;
  user_id: number;
  title: string;
  content: string;
  category: PostCategory;
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

// Request 타입
export interface CreatePostRequest {
  title: string;
  content: string;
  category: PostCategory;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  category?: PostCategory;
}

export interface CreateReplyRequest {
  content: string;
}

// Response 타입
export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  size: number;
}

export interface RepliesResponse {
  replies: Reply[];
  total: number;
  page: number;
  size: number;
}

