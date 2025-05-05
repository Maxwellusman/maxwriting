// components/BlogPostCarousel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  createdAt: string;
}

const BlogPostCarousel = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog?limit=6');
        const { data } = await response.json();
        setBlogPosts(data || []);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchBlogPosts, 500);
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton height={200} className="w-full" />
            <div className="p-6">
              <Skeleton count={2} />
              <Skeleton width={100} className="mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (blogPosts.length === 0) {
    return <div className="text-center py-8">No blog posts found</div>;
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: blogPosts.length >= 2 ? 2 : 1,
          },
          1024: {
            slidesPerView: blogPosts.length >= 3 ? 3 : blogPosts.length >= 2 ? 2 : 1,
          },
        }}
        className="pb-12"
      >
        {blogPosts.map((post) => (
          <SwiperSlide key={post._id}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
              {post.imageUrl ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    unoptimized={process.env.NODE_ENV !== 'production'} // Only optimize in production
                  />
                </div>
              ) : (
                <div className="bg-gray-100 h-48 w-full flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                )}
              </div>
              <div className="px-6 pb-6">
                <Link 
                  href={`/blogs/${post.slug}`} passHref
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  aria-label={`Read more about ${post.title}`}
                  prefetch={false}
                >
                  Read More →
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogPostCarousel;