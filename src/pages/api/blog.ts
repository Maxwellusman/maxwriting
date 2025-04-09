import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import BlogPost from '../../models/BlogPost';
import mongoose from 'mongoose';

interface BlogPostData {
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  focusKeyword?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        // Get pagination parameters from query
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Get sorting parameters
        const sortBy = req.query.sortBy as string || 'createdAt';
        const sortOrder = req.query.sortOrder as string === 'asc' ? 1 : -1;

        // Get total count for pagination
        const totalPosts = await BlogPost.countDocuments({});
        const totalPages = Math.ceil(totalPosts / limit);

        // Get posts with pagination and sorting
        const posts = await BlogPost.find({})
          .select('title slug excerpt imageUrl createdAt updatedAt')
          .sort({ [sortBy]: sortOrder })
          .skip(skip)
          .limit(limit)
          .lean();

        res.status(200).json({
          success: true,
          data: posts,
          pagination: {
            page,
            limit,
            totalPosts,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ 
          success: false,
          error: 'Failed to fetch posts',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'POST':
      try {
        const { 
          title, 
          content, 
          slug, 
          imageUrl,
          excerpt,
          metaTitle,
          metaDescription,
          keywords,
          focusKeyword
        } = req.body as BlogPostData;

        // Validate required fields
        if (!title || !content || !slug) {
          return res.status(400).json({
            success: false,
            error: 'Title, content, and slug are required'
          });
        }

        // Validate slug format
        if (!/^[a-z0-9-]+$/.test(slug)) {
          return res.status(400).json({
            success: false,
            error: 'Slug can only contain lowercase letters, numbers, and hyphens'
          });
        }

        // Check for existing slug
        const existingPost = await BlogPost.findOne({ slug });
        if (existingPost) {
          return res.status(400).json({
            success: false,
            error: 'Slug already exists'
          });
        }

        // Clean and validate keywords
        const cleanedKeywords = keywords 
          ? keywords.map(k => k.trim()).filter(k => k.length > 0)
          : [];

        // Create new post with all SEO fields
        const newPost = new BlogPost({ 
          title: title.trim(),
          content: content.trim(),
          slug: slug.trim(),
          imageUrl,
          excerpt: excerpt?.trim(),
          metaTitle: metaTitle?.trim(),
          metaDescription: metaDescription?.trim(),
          keywords: cleanedKeywords,
          focusKeyword: focusKeyword?.trim()
        });

        await newPost.save();

        res.status(201).json({
          success: true,
          data: {
            _id: newPost._id,
            title: newPost.title,
            slug: newPost.slug,
            createdAt: newPost.createdAt,
            updatedAt: newPost.updatedAt
          }
        });
      } catch (error) {
        console.error('Error creating post:', error);
        
        // Handle duplicate key errors specifically
        if (error instanceof mongoose.Error && error.name === 'MongoServerError' && 
            (error as any).code === 11000) {
          return res.status(400).json({
            success: false,
            error: 'Slug must be unique',
            message: 'A post with this slug already exists'
          });
        }

        res.status(500).json({
          success: false,
          error: 'Failed to create post',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`
      });
  }
}