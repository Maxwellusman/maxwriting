import { Document } from 'mongoose';

export interface IBlogPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// For lean documents
export type BlogPostLean = Pick<IBlogPost, '_id' | 'title' | 'content'> & {
  _id: string;
};