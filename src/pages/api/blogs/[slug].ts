import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import BlogPost from '../../../models/BlogPost';
import { put } from '@vercel/blob';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const { slug } = req.query;

    if (Array.isArray(slug)) {
      return res.status(400).json({ error: 'Invalid slug format' });
    }

    if (!slug) {
      return res.status(400).json({ error: 'Slug parameter is required' });
    }

    await connectToDatabase();

    const post = await BlogPost.findOne({ slug }).lean();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // If imageUrl is from Blob storage and needs to be refreshed
    if (post.imageUrl?.includes('blob.vercel-storage.com')) {
      // You might want to add logic here to refresh the Blob URL if needed
      // For example, generate a new signed URL if your storage requires it
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}