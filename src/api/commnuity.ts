import apiClient  from "./client";
import {
  PostCategory,
  Post,
  UpdatePostRequest,
  CreateReplyRequest,
  Reply,
  CreatePostRequest,
  PostsResponse,
  RepliesResponse,
} from "@/types/community";
import { BaseResponse } from "@/types/commonTypes";

export const getPost = async (): Promise<PostsResponse> =>{
    const response = await apiClient.get<PostsResponse>('/posts/')
    console.log('###### getPost() :', response.data)
    return response.data
}// end getPost()

export const createPost = async (data : CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post('/posts/', data)
    console.log('###### createPost() : ', response.data)
    return response.data
}// end createPost()

export const getPostById = async (postId: number): Promise<Post> => {
  const response = await apiClient.get<Post>(`/posts/${postId}`);
  console.log("getPostById() :", response.data);
  return response.data;
} // end getPostById

export const updatePostById = async (
  postId: number,
  data: UpdatePostRequest
): Promise<Post> => {
  const response = await apiClient.put<Post>(`/posts/${postId}`, data);
  console.log("updatePostById() :", response.data);
  return response.data;
}// end updatePostById()

export const deletePostById = async (postId:number) =>{
    const response = await apiClient.delete(`/posts/${postId}`)
    console.log('### deletePostById() :', response.data)
    return response.data
} // end deletePostsById

export const getReplies = async(postId:number) : Promise<RepliesResponse> =>{
    const response = await apiClient.get(`/posts/${postId}/replies`)
    console.log('getReplies(): ', response.data)
    return response.data
}// end getReplies


export const createReply = async (
  postId: number,
  data: CreateReplyRequest
): Promise<Reply> => {
  const response = await apiClient.post(`/posts/${postId}/replies`, data)
  console.log('## createReply() :', response.data)
  return response.data
}; // end createReply

export const deleteReply = async (replyId: number) => {
  const response = await apiClient.delete(`/replies/${replyId}`);

  if (response.status === 200 || response.status === 204) {
    console.log("deleteReply() 성공:", response.data);
  } else {
    console.error("deleteReply() 실패:", response.status, response.data);
  }

  return response.data;
};