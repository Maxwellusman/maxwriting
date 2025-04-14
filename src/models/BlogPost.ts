import { Schema, model, models, Document, Model } from 'mongoose';

export interface BlogPostDocument extends Document {
  title: string;
  content: string;
  slug: string;
  imageUrl: string; // Now stores Vercel Blob URL
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  focusKeyword?: string;
  writer: string;
  linkedinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogPostLean = Omit<BlogPostDocument, keyof Document> & {
  _id: string;
};

const BlogPostSchema = new Schema<BlogPostDocument>(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: { 
      type: String, 
      required: [true, 'Content is required'] 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      index: true,
      validate: {
        validator: (v: string) => /^[a-z0-9-]+$/.test(v),
        message: 'Slug can only contain lowercase letters, numbers, and hyphens'
      }
    },
    imageUrl: { 
      type: String,
      validate: {
        validator: (v: string) => v.startsWith('https://') || v.startsWith('blob:'),
        message: 'Image URL must be a valid https or blob URL'
      }
    },
    excerpt: { 
      type: String, 
      maxlength: [160, 'Excerpt cannot exceed 160 characters'],
      trim: true 
    },
    metaTitle: { 
      type: String, 
      maxlength: [60, 'Meta title cannot exceed 60 characters'],
      trim: true 
    },
    metaDescription: { 
      type: String, 
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
      trim: true 
    },
    keywords: [{ 
      type: String, 
      trim: true 
    }],
    focusKeyword: { 
      type: String, 
      trim: true 
    },
    writer: { 
      type: String, 
      required: [true, 'Writer name is required'],
      trim: true 
    },
    linkedinUrl: { 
      type: String,
      validate: {
        validator: (v: string) => !v || v.startsWith('https://www.linkedin.com/'),
        message: 'LinkedIn URL must start with https://www.linkedin.com/'
      },
      trim: true 
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
        return ret;
      }
    },
    toObject: {
      virtuals: true
    }
  }
);

// Text index for search functionality
BlogPostSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text',
  keywords: 'text',
  focusKeyword: 'text'
});

// Compound index for frequently queried fields
BlogPostSchema.index({ 
  slug: 1, 
  createdAt: -1 
});

const BlogPost: Model<BlogPostDocument> = 
  models.BlogPost || model<BlogPostDocument>('BlogPost', BlogPostSchema);

export default BlogPost;