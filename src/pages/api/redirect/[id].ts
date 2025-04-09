// pages/api/redirect/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import BlogPost from '@/models/BlogPost';
import connectDB from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;
  
  const post = await BlogPost.findById(id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  
  return res.redirect(308, `/admin/blog/edit/${post.slug}`);
}