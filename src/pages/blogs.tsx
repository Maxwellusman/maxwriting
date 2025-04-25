import { GetServerSideProps } from 'next';
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

interface BlogsProps {
  posts: BlogPostDocument[] | null;
  currentPage: number;
  totalPages: number;
}

export default function Blogs({ posts, currentPage, totalPages }: BlogsProps) {
  const router = useRouter();
  const siteUrl = 'https://maxwritings.com';

  const seoTitle = `Read Expert Blog Posts on Writing | MaxWritings`;
  const seoDescription = `Explore professional blogs, expert writing tips, and industry updates. Stay informed with the latest from MaxWritings.`;

  const getCanonicalUrl = () => {
    const path = router.asPath.split('?')[0].replace(/\/$/, '');
    const pageSuffix = currentPage > 1 ? `?page=${currentPage}` : '';
    return `${siteUrl}${path}${pageSuffix}`;
  };

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="writing blog, content writing, blog articles, professional writing tips" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl()} />
        <meta property="og:site_name" content="MaxWritings" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <link rel="canonical" href={getCanonicalUrl()} />
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

          {Array.isArray(posts) && posts.length > 0 ? (
            <>
              <main className="grid gap-8 md:grid-cols-4 lg:grid-cols-6">
                {posts.map((post, index) => (
                  <article
                    key={post._id}
                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <Link href={`/blogs/${post.slug}`} passHref>
                      <div className="cursor-pointer h-full flex flex-col">
                        {post.imageUrl ? (
                          <div className="relative h-48 w-full">
                            <Image
                              src={post.imageUrl}
                              alt={`Cover image for ${post.title}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={currentPage === 1 && index < 3}
                              unoptimized={post.imageUrl.includes('blob.vercel-storage.com')}
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
                      <Link
                        key={page}
                        href={`/blogs?page=${page}`}
                        className={`px-4 py-2 rounded-md ${page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </Link>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = parseInt((context.query.page as string) || '1');
  const limit = 6;

  try {
    const res = await fetch(`https://maxwritings.com/api/blog?page=${page}&limit=${limit}`);
    const data = await res.json();

    if (!res.ok || !data.success || !Array.isArray(data.data)) {
      throw new Error('Invalid response structure');
    }

    return {
      props: {
        posts: data.data,
        currentPage: page,
        totalPages: data.pagination.totalPages,
      },
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      props: {
        posts: [],
        currentPage: page,
        totalPages: 1,
      },
    };
  }
};
