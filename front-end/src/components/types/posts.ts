// src/types/posts.ts
export interface Post {
  _id?: string;
  title: string;
  content: string;
  image?: string;
  author: {
    username: string;
    profileImage?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}