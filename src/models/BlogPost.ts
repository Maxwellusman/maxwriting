import { Schema, model, models, Document, Model } from 'mongoose';

export interface BlogPostDocument extends Document {
  title: string;
  content: string;
  slug: string;
  imageUrl: string;
  excerpt: string; // Add excerpt for meta descriptions
  metaTitle: string; // Custom meta title
  metaDescription: string; // Custom meta description
  keywords: string[]; // SEO keywords
  createdAt: Date;
  updatedAt: Date;
}

export type BlogPostLean = Omit<BlogPostDocument, keyof Document> & {
  _id: string;
};

const BlogPostSchema = new Schema<BlogPostDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    imageUrl: { type: String },
    excerpt: { type: String, maxlength: 160 }, // Optimal length for meta descriptions
    metaTitle: { type: String, maxlength: 60 }, // Optimal length for meta titles
    metaDescription: { type: String, maxlength: 160 },
    keywords: [{ type: String }],
  },
  {
    timestamps: true,
    collection: 'blogposts',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add text index for search
BlogPostSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text',
  keywords: 'text'
});

const BlogPost = models.BlogPost as Model<BlogPostDocument> ||
  model<BlogPostDocument>('BlogPost', BlogPostSchema, 'blogposts');

export default BlogPost;