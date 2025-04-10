import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import BlogPost from '../../../models/BlogPost';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        if (!mongoose.Types.ObjectId.isValid(id as string)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid post ID'
          });
        }

        const post = await BlogPost.findById(id).lean();

        if (!post) {
          return res.status(404).json({
            success: false,
            error: 'Post not found'
          });
        }

        res.status(200).json({
          success: true,
          data: post
        });
      } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch post',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'PUT':
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
          focusKeyword,
          writer,
          linkedinUrl
        } = req.body;

        // Validate required fields
        if (!title || !content || !slug || !writer) {
          return res.status(400).json({
            success: false,
            error: 'Title, content, slug, and writer are required'
          });
        }

        // Validate slug format
        if (!/^[a-z0-9-]+$/.test(slug)) {
          return res.status(400).json({
            success: false,
            error: 'Slug can only contain lowercase letters, numbers, and hyphens'
          });
        }

        // Check for existing slug with different ID
        const existingPost = await BlogPost.findOne({ slug, _id: { $ne: id } });
        if (existingPost) {
          return res.status(400).json({
            success: false,
            error: 'Slug already exists for another post'
          });
        }

        // Clean and validate keywords
        const cleanedKeywords: string[] = keywords 
          ? keywords.map((k: string) => k.trim()).filter((k: string) => k.length > 0)
          : [];

        const updatedPost = await BlogPost.findByIdAndUpdate(
          id,
          { 
            title: title.trim(),
            content: content.trim(),
            slug: slug.trim(),
            imageUrl,
            excerpt: excerpt?.trim(),
            metaTitle: metaTitle?.trim(),
            metaDescription: metaDescription?.trim(),
            keywords: cleanedKeywords,
            focusKeyword: focusKeyword?.trim(),
            writer: writer.trim(),
            linkedinUrl: linkedinUrl?.trim()
          },
          { new: true }
        );

        if (!updatedPost) {
          return res.status(404).json({
            success: false,
            error: 'Post not found'
          });
        }

        res.status(200).json({
          success: true,
          data: updatedPost
        });
      } catch (error) {
        console.error('Error updating post:', error);
        
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
          error: 'Failed to update post',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'DELETE':
      try {
        if (!mongoose.Types.ObjectId.isValid(id as string)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid post ID'
          });
        }

        const deletedPost = await BlogPost.findByIdAndDelete(id);

        if (!deletedPost) {
          return res.status(404).json({
            success: false,
            error: 'Post not found'
          });
        }

        res.status(200).json({
          success: true,
          data: {
            message: 'Post deleted successfully',
            postId: id
          }
        });
      } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to delete post',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`
      });
  }
}