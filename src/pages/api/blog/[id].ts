import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import mongoose from 'mongoose';

interface BlogPostResponse {
  _id: string;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`Incoming ${req.method} request for /api/blog/${req.query.id}`);
  
  try {
    await connectToDatabase();
    const { id } = req.query;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      console.log('Invalid ID format:', id);
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    switch (req.method) {
      case 'GET':
        const post = await BlogPost.findById(id).lean();
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }
        return res.status(200).json({
          _id: post._id.toString(),
          title: post.title,
          content: post.content,
          slug: post.slug,
          imageUrl: post.imageUrl || null,
        });

      case 'PUT':
        const { title, content, slug, imageUrl } = req.body;
        
        if (!title?.trim() || !content?.trim()) {
          console.log('Missing title or content');
          return res.status(400).json({ error: 'Title and content are required' });
        }
        const updateData: {
          title: string;
          content: string;
          updatedAt: Date;
          slug: string;
          imageUrl?: string;
        } = { 
          title: title.trim(), 
          content: content.trim(),
          updatedAt: new Date(),
          slug: slug || title.trim().toLowerCase().replace(/\s+/g, '-')
        };

        // Only update imageUrl if it was provided (could be empty string to remove image)
        if (typeof imageUrl !== 'undefined') {
          updateData.imageUrl = imageUrl;
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        ).lean<BlogPostResponse>();

        if (!updatedPost) {
          return res.status(404).json({ error: 'Post not found' });
        }

        return res.status(200).json({
          _id: updatedPost._id.toString(),
          title: updatedPost.title,
          content: updatedPost.content,
          slug: updatedPost.slug,
          imageUrl: updatedPost.imageUrl || null,
        });

      case 'DELETE':
        const deletedPost = await BlogPost.findByIdAndDelete(id).lean<BlogPostResponse>();
        
        if (!deletedPost) {
          console.log('Post not found for deletion:', id);
          return res.status(404).json({ error: 'Post not found' });
        }
        return res.status(200).json({
          _id: deletedPost._id.toString(),
          title: deletedPost.title,
          content: deletedPost.content,
          slug: deletedPost.slug,
          imageUrl: deletedPost.imageUrl || null,
        });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    return res.status(500).json({ 
      error: 'Internal server error',
      message: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}