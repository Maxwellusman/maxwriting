import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
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
  writer: string;
  linkedinUrl?: string;
}

// Helper function to transform blob URLs
const transformImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  
  // If using Vercel Blob's internal reference format
  if (url.startsWith('blob:')) {
    return `https://blob.vercel-storage.com/${url.replace('blob:', '')}`;
  }
  
  // If already a full URL or relative path
  return url;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  const { id } = req.query;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE');

  try {
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid post ID format' 
      });
    }

    switch (req.method) {
      case 'GET':
        const post = await BlogPost.findById(id)
          .select('-__v')
          .lean();

        if (!post) {
          return res.status(404).json({ 
            success: false,
            error: 'Post not found' 
          });
        }

        // Transform image URL before sending response
        const transformedPost = {
          ...post,
          imageUrl: transformImageUrl(post.imageUrl)
        };

        return res.status(200).json({ 
          success: true,
          data: transformedPost 
        });

      case 'PUT':
        const { 
          title, 
          content, 
          slug, 
          imageUrl,
          excerpt,
          metaTitle,
          metaDescription,
          keywords,
          focusKeyword,
          writer,
          linkedinUrl
        } = req.body as BlogPostData;

        // Validation
        if (!title || !content || !slug || !writer) {
          return res.status(400).json({ 
            success: false,
            error: 'Missing required fields' 
          });
        }

        // Check for slug conflict
        const existingSlug = await BlogPost.findOne({ 
          slug, 
          _id: { $ne: id } 
        });
        
        if (existingSlug) {
          return res.status(400).json({ 
            success: false,
            error: 'Slug already in use' 
          });
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(
          id,
          {
            title: title.trim(),
            content: content.trim(),
            slug: slug.trim(),
            imageUrl: imageUrl?.trim(), // Store as-is (transformation happens on GET)
            excerpt: excerpt?.trim(),
            metaTitle: metaTitle?.trim(),
            metaDescription: metaDescription?.trim(),
            keywords: keywords?.map(k => k.trim()).filter(k => k) || [],
            focusKeyword: focusKeyword?.trim(),
            writer: writer.trim(),
            linkedinUrl: linkedinUrl?.trim()
          },
          { new: true }
        ).lean();

        return res.status(200).json({ 
          success: true,
          data: {
            ...updatedPost,
            imageUrl: transformImageUrl(updatedPost?.imageUrl)
          } 
        });

      case 'DELETE':
        const deletedPost = await BlogPost.findByIdAndDelete(id);
        
        if (!deletedPost) {
          return res.status(404).json({ 
            success: false,
            error: 'Post not found' 
          });
        }

        return res.status(200).json({ 
          success: true,
          data: { id } 
        });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ 
          success: false,
          error: `Method ${req.method} not allowed` 
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}