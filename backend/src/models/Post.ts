import { Schema, model, Types } from "mongoose";

export interface IPost {
  title: string;
  content: string;
  image?: string;
  author: Types.ObjectId; // ارتباط با Admin
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Post = model<IPost>("Post", postSchema);
