import { GetServerSideProps } from 'next';
import dbConnect from '@/lib/mongodb';
import BlogPost, { BlogPostLean } from '@/models/BlogPost';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

interface AdminBlogProps {
  posts: {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
  }[];
  page: number;
  totalPages: number;
}

export default function AdminBlog({ posts, page, totalPages }: AdminBlogProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setDeletingId(id);
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      router.replace(router.asPath); // Refresh the page
    } catch (error) {
      console.error('Delete error:', error);
      alert(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          New Post
        </Link>
      </div>
      
      <div className="space-y-4 mb-8">
        {posts.map(post => (
          <div key={post._id} className="border p-4 rounded-lg shadow-sm relative">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link 
                  href={`/admin/blog/edit/${post._id}`}
                  className="text-blue-600 hover:text-blue-800 px-2 py-1"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  disabled={deletingId === post._id}
                  className="text-red-600 hover:text-red-800 px-2 py-1 disabled:opacity-50"
                >
                  {deletingId === post._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            <p className="text-gray-600 mt-2">{post.content.slice(0, 100)}...</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {page > 1 && (
            <Link 
              href={`/admin/blog?page=${page - 1}`}
              className="px-4 py-2 border rounded"
            >
              Previous
            </Link>
          )}
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/blog?page=${p}`}
              className={`px-4 py-2 border rounded ${
                p === page ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {p}
            </Link>
          ))}
          
          {page < totalPages && (
            <Link 
              href={`/admin/blog?page=${page + 1}`}
              className="px-4 py-2 border rounded"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await getSession(context);
  
    if (!session) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

  const page = Number(context.query.page) || 1;
  const perPage = 10; // Posts per page

  try {
    await dbConnect();
    
    // Get total count of posts
    const totalPosts = await BlogPost.countDocuments({});
    const totalPages = Math.ceil(totalPosts / perPage);
    
    // Get posts sorted by newest first with pagination
    const posts = await BlogPost.find({})
      .sort({ createdAt: -1 }) // Newest first
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean<BlogPostLean[]>();
    
    return {
      props: {
        posts: posts.map(post => ({
          _id: post._id.toString(),
          title: post.title,
          content: post.content,
          createdAt: post.createdAt.toISOString()
        })),
        page,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { props: { posts: [], page: 1, totalPages: 1 } };
  }
};