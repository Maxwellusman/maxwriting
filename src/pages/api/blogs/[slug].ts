import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import BlogPost from '../../../models/BlogPost';

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

    await connectToDatabase(); // Just connect, no destructuring

    const post = await BlogPost.findOne({ slug }).lean(); // Use Mongoose model

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
