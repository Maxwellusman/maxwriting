

import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import BlogPost, { BlogPostLean } from '@/models/BlogPost';
import mongoose from 'mongoose';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { id } = req.query;

  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Handle PUT request
    if (req.method === 'PUT') {
      const { title, content } = req.body;

      if (!title?.trim() || !content?.trim()) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const updatedPost = await BlogPost.findByIdAndUpdate(
        id,
        { 
          title: title.trim(), 
          content: content.trim(),
          updatedAt: new Date() 
        },
        { new: true, runValidators: true }
      ).lean<BlogPostLean>();

      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json({
        _id: updatedPost._id.toString(),
        title: updatedPost.title,
        content: updatedPost.content
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}