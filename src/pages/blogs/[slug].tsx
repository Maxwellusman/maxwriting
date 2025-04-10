import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { FiCalendar, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaLinkedin, FaBookmark, FaRegBookmark } from 'react-icons/fa';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
  slug: string;
  category?: string;
  readTime?: string;
  writer: string;
  linkedinUrl?: string;
}

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/blogs/${slug}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
          throw new Error('Received empty response');
        }

        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? 'Date not available'
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
    } catch (error) {
      return 'Date not available';
    }
  };

  const handleShare = (platform: string) => {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`;
    const text = `Check out this article: ${post?.title}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(post?.title || '')}`, '_blank');
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: post?.title,
            text: text,
            url: url,
          }).catch(() => {});
        }
    }
    
    setIsShareOpen(false);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <FiRefreshCw className="animate-spin text-4xl text-indigo-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800">Loading Article</h2>
        <p className="text-gray-600 mt-2">Fetching the content for you...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 flex flex-col items-center justify-center px-4">
      <div className="max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Post</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <FiRefreshCw /> Retry
          </button>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FiArrowLeft /> Back Home
          </button>
        </div>
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 flex flex-col items-center justify-center px-4">
      <div className="max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="text-gray-400 text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h2>
        <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or may have been removed.</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <FiArrowLeft /> Browse Other Articles
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{post.title} | Your Blog Name</title>
        <meta name="description" content={post.content.substring(0, 150) + '...'} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 150) + '...'} />
        <meta property="og:image" content={post.imageUrl || '/default-image.jpg'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.content.substring(0, 150) + '...'} />
        <meta name="twitter:image" content={post.imageUrl || '/default-image.jpg'} />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <button 
                onClick={() => router.push('/blogs')}
                className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <FiArrowLeft className="mr-2" /> Back to Blog
              </button>
              <div className="flex items-center space-x-4">
                {/* <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                  aria-label="Bookmark"
                >
                  {isBookmarked ? <FaBookmark className="text-indigo-600" /> : <FaRegBookmark />}
                </button> */}
                <div className="relative">
                  <button 
                    onClick={() => setIsShareOpen(!isShareOpen)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Share
                  </button>
                  {isShareOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                      <button 
                        onClick={() => handleShare('twitter')}
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                      >
                        <FaTwitter className="text-blue-400 mr-2" /> Twitter
                      </button>
                      <button 
                        onClick={() => handleShare('facebook')}
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                      >
                        <FaFacebook className="text-blue-600 mr-2" /> Facebook
                      </button>
                      <button 
                        onClick={() => handleShare('linkedin')}
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                      >
                        <FaLinkedin className="text-blue-700 mr-2" /> LinkedIn
                      </button>
                      <button 
                        onClick={() => handleShare('native')}
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                      >
                        Other...
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Featured Image */}
            {post.imageUrl && (
              <div className="relative h-96 w-full">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1000px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}

            <div className="px-6 py-8 sm:px-12 sm:py-12 lg:px-16">
              {/* Category and Read Time */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {post.category && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                )}
                {post.readTime && (
                  <span className="text-gray-500 text-sm">{post.readTime} read</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {post.title}
              </h1>

              {/* Author and Date */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                  {post.writer?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    {post.writer || 'Anonymous'}
                    {post.linkedinUrl && (
                      <a 
                        href={post.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <FaLinkedin className="inline" />
                      </a>
                    )}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FiCalendar className="mr-1" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div 
                className="prose max-w-none text-gray-700 text-lg mb-12"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />

              {/* Tags and Social Sharing */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">SHARE THIS ARTICLE</h3>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleShare('twitter')}
                        className="p-2 rounded-full bg-blue-50 text-blue-400 hover:bg-blue-100 transition-colors"
                        aria-label="Share on Twitter"
                      >
                        <FaTwitter size={18} />
                      </button>
                      <button 
                        onClick={() => handleShare('facebook')}
                        className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        aria-label="Share on Facebook"
                      >
                        <FaFacebook size={18} />
                      </button>
                      <button 
                        onClick={() => handleShare('linkedin')}
                        className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        aria-label="Share on LinkedIn"
                      >
                        <FaLinkedin size={18} />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Top
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Author Bio */}
          {post.writer && (
            <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl font-bold">
                    {post.writer.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">About '{post.writer}'</h3>
                  <p className="text-gray-600">
                    {post.linkedinUrl && (
                      <a 
                        href={post.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
                      >
                        <FaLinkedin className="mr-1" /> Connect on LinkedIn
                      </a>
                    )}
                  </p>
                  <p className="text-gray-600">
                    {post.writer} is a contributor to our blog. 
                    {post.linkedinUrl && ' Connect with them on LinkedIn to learn more about their work.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Newsletter CTA */}
        <section className="bg-indigo-700 text-white py-16 px-4 sm:px-6 lg:px-8 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay updated with our newsletter</h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Get the latest articles and resources sent straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button className="px-6 py-3 bg-white text-indigo-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}