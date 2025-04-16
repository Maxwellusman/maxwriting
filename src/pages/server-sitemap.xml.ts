// pages/server-sitemap.xml.ts
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSideSitemapLegacy } from 'next-sitemap';
import BlogPost from '../models/BlogPost';
import dbConnect from '../lib/mongodb';

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    await dbConnect();
    const blogs = await BlogPost.find({}, { slug: 1, updatedAt: 1 }).lean();

    const fields = blogs.map((blog) => ({
      loc: `https://maxwritings.com/blogs/${blog.slug}`,
      lastmod: new Date(blog.updatedAt).toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.8,
    }));

    // Use the legacy version which is compatible with GetServerSideProps
    return getServerSideSitemapLegacy(ctx, fields);
  } catch (error) {
    console.error('Error generating server sitemap:', error);
    // Return empty sitemap on error
    return getServerSideSitemapLegacy(ctx, []);
  }
};

// Default export to prevent next.js errors
export default function Sitemap() {}