'use client';

import Image from 'next/image';
import React from 'react';

const Banner: React.FC = () => {
  return (
    <div className="relative py-10 md:py-0 md:h-screen w-full grid place-items-center text-center px-4">
      {/* Fixed Background Image */}
      <Image
        src="/images/2147982615.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={80}
        priority={false} // Lazy loading enabled
        className="fixed top-0 left-0 w-full h-full -z-10"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-6 lg:px-6 xl:px-10 2xl:px-0 max-w-sm md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
        <h1 className="text-white font-bold font-prosto text-[24px] md:text-[36px] lg:text-[48px]">Best Writing Services</h1>
        <p className="text-white font-Poppins text-[16px] md:text-[18px] mt-4 md:w-[80%] lg:w-[50%] mx-auto">
          We at Max Writings® aim to build high-quality SEO-optimized articles to help your website rank on Google’s first page and grow your business.
        </p>

        {/* Responsive Grid Layout */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-700 bg-opacity-90 p-6 rounded-lg">
            <h2 className="text-primary-orange text-3xl font-bold">99+</h2>
            <p className="text-white">Happy Clients</p>
          </div>
          <div className="bg-gray-700 bg-opacity-90 p-6 rounded-lg">
            <h2 className="text-primary-orange  text-3xl font-bold">10,000+</h2>
            <p className="text-white">Articles Written</p>
          </div>
          <div className="bg-gray-700 bg-opacity-90 p-6 rounded-lg">
            <h2 className="text-primary-orange  text-3xl font-bold">3+</h2>
            <p className="text-white">Years Experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
