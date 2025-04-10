import { Schema, model, models, Document, Model } from 'mongoose';

export interface BlogPostDocument extends Document {
  title: string;
  content: string;
  slug: string;
  imageUrl: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  focusKeyword: string;
  writer: string; // Added field
  linkedinUrl: string; // Added field
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
    excerpt: { type: String, maxlength: 160 },
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
    keywords: [{ type: String }],
    focusKeyword: { type: String },
    writer: { type: String, required: true }, // Added as required field
    linkedinUrl: { type: String } // Added as optional field
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