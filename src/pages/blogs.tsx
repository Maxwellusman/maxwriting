import { useEffect, useState, useRef } from 'react';
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
  writer?: string;
}

export default function Blogs() {
  const [posts, setPosts] = useState<BlogPostDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const pageSize = 6;
  const siteUrl = 'https://maxwritings.com';

  const cacheRef = useRef<{ [key: number]: BlogPostDocument[] }>({});

  useEffect(() => {
    const fetchPosts = async () => {
      // Use cache first
      if (cacheRef.current[currentPage]) {
        setPosts(cacheRef.current[currentPage]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch(`/api/blog?page=${currentPage}&limit=${pageSize}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch posts');

        if (data.success) {
          const sorted = data.data.sort(
            (a: BlogPostDocument, b: BlogPostDocument) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          cacheRef.current[currentPage] = sorted; // Store in cache
          setPosts(sorted);
          setTotalPages(data.pagination.totalPages);
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

  const handleImageError = (postId: string) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  const seoTitle = `Read Expert Blog Posts on Writing | MaxWritings`;
  const seoDescription = `Explore professional blogs, expert writing tips, and industry updates. Stay informed with the latest from MaxWritings.`;
  const canonicalUrl = `${siteUrl}${router.asPath}`;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="writing blog, content writing, blog articles, professional writing tips" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="MaxWritings" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
              MaxWritings Blog
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-xl text-gray-600">
              Expert writing guides, updates & tips from professionals
            </p>
          </header>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-6">
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
              <main className="grid gap-8 md:grid-cols-4 lg:grid-cols-6">
                {posts.map((post) => (
                  <article
                    key={post._id}
                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <Link href={`/blogs/${post.slug}`} passHref>
                      <div className="cursor-pointer h-full flex flex-col">
                        {post.imageUrl && !imageErrors[post._id] ? (
                          <div className="relative h-48 w-full">
                            <Image
                              src={post.imageUrl}
                              alt={`Cover image for ${post.title}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={currentPage === 1 && posts.indexOf(post) < 3}
                              unoptimized={post.imageUrl.includes('blob.vercel-storage.com')}
                              onError={() => handleImageError(post._id)}
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          </div>
                        ) : (
                          <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          <h2 className="text-[14px] font-semibold text-gray-900 mb-2 hover:text-primary-orange transition-colors">
                            {post.metaTitle || post.title}
                          </h2>
                          <div className="mt-auto flex justify-between items-center">
                            <time
                              dateTime={new Date(post.createdAt).toISOString()}
                              className="text-sm text-gray-500 mb-2"
                            >
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </time>
                          </div>
                          {post.writer && (
                            <span className="text-sm text-gray-500 mb-3">
                              By {post.writer}
                            </span>
                          )}
                          <span className="text-sm font-medium text-primary-orange hover:text-orange-600 transition-colors">
                            Read more →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </main>

              {totalPages > 1 && (
                <nav className="mt-12 flex justify-center" aria-label="Pagination">
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`px-4 py-2 rounded-md ${currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </nav>
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
