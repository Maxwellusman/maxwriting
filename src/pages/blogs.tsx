import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';

export interface BlogPostDocument {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  createdAt: string;
  slug: string;
  imageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export default function Blogs() {
  const [posts, setPosts] = useState<BlogPostDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const pageSize = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog?page=${currentPage}&pageSize=${pageSize}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const sorted = data.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setPosts(sorted);
          setTotalPages(1);
        } else if (data.success) {
          const sorted: BlogPostDocument[] = data.data.sort(
            (a: BlogPostDocument, b: BlogPostDocument) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setPosts(sorted);
          setTotalPages(data.pagination.totalPages);
        } else {
          console.error('Unexpected API response:', data);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Blog Posts | Your Site Name</title>
        <meta name="description" content="Browse our latest blog posts and articles" />
        <meta name="keywords" content="blog, articles, posts, news" />
        <meta property="og:title" content="Blog Posts | Your Site Name" />
        <meta property="og:description" content="Browse our latest blog posts and articles" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`} />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`} />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
              Our Blog
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-xl text-gray-600">
              Latest articles, news, and updates
            </p>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(pageSize)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="animate-pulse bg-gray-200 h-48 w-full"></div>
                  <div className="p-6">
                    <div className="animate-pulse bg-gray-200 h-7 w-4/5 mb-4 rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-4 w-3/5 mb-2 rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-4 w-2/5 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <div
                    key={post._id}
                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <Link href={`/blogs/${post.slug}`} passHref>
                      <div className="cursor-pointer h-full flex flex-col">
                        {post.imageUrl && (
                          <div className="relative h-48 w-full">
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={currentPage === 1 && index < 3}
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                            {post.metaTitle || post.title}
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.metaDescription || post.excerpt || ''}
                          </p>
                          <div className="mt-auto flex justify-between items-center">
                            <time
                              dateTime={new Date(post.createdAt).toISOString()}
                              className="text-sm text-gray-500"
                            >
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </time>
                            <span className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                              Read more →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-medium text-gray-600">No blog posts found</h2>
              <p className="mt-4 text-gray-500">Check back later for new articles</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
