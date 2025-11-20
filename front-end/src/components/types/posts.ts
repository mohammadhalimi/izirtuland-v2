// src/types/posts.ts
export interface Post {
  _id?: string;
  title: string;
  content: string;
  metaDescription?: string; // ⭐ جدید
  image?: string;
  author: {
    username: string;
    profileImage?: string;
  };
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}