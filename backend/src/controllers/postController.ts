import { Request, Response } from "express";
import { Post } from "../models/Post";

export const createPost = async (req: any, res: Response) => {
  try {
    const { title, content , metaDescription , tags } = req.body;

    const image = req.file ? "/uploads/" + req.file.filename : null;

    const post = await Post.create({
      title,
      content,
      image,
      metaDescription,
      tags: tags ? tags.split(",") : [], // اگر کاربر با کاما بفرستد
      author: req.admin.id
    });

    res.status(201).json({
      message: "پست با موفقیت ایجاد شد",
      post
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("author", "username profileImage");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username profileImage"
    );

    if (!post)
      return res.status(404).json({ message: "پست یافت نشد" });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deletePost = async (req: any, res: Response) => {
  try {
    const postId = req.params.id;

    // پیدا کردن پست برای بررسی مالکیت
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: "پست مورد نظر پیدا نشد" });
    }

    // بررسی آیا کاربر مالک پست است یا سوپر ادمین
    // اگر می‌خواهید فقط مالک پست بتواند آن را حذف کند:
    // if (post.author.toString() !== req.admin.id && req.admin.role !== 'superadmin') {
    //   return res.status(403).json({ message: "شما اجازه حذف این پست را ندارید" });
    // }

    // حذف پست
    const deletedPost = await Post.findByIdAndDelete(postId);
    
    if (!deletedPost) {
      return res.status(404).json({ message: "پست مورد نظر پیدا نشد" });
    }

    res.status(200).json({ 
      message: "پست با موفقیت حذف شد",
      post: deletedPost 
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};