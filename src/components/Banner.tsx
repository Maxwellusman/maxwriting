'use client';

import Image from 'next/image';
import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Banner: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });

  return (
    <div className="relative py-10 md:py-0 md:h-screen w-full grid place-items-center text-center px-4">
      {/* Fixed Background Image */}
      <Image
        src="/images/2147982615.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={80}
        fill
        priority
        className="fixed top-0 left-0 w-full h-full -z-10"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-6 lg:px-6 xl:px-10 2xl:px-0 max-w-sm md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
        <h1 className="text-white font-bold font-prosto text-[24px] md:text-[36px] lg:text-[48px]">
          Best Writing Services
        </h1>
        <p className="text-white font-Poppins text-[16px] md:text-[18px] mt-4 md:w-[80%] lg:w-[50%] mx-auto font-bold">
          We at Max Writings® aim to build high-quality SEO-optimized articles to help your website rank on Google's first page and grow your business.
        </p>

        {/* Counters - Now fully circular */}
        <div ref={ref} className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6">
          {/* Happy Clients */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-700 bg-opacity-90 flex flex-col items-center justify-center">
              <h2 className="text-primary-orange text-3xl font-bold">
                {inView ? <CountUp end={99} duration={2} /> : 0}+
              </h2>
            </div>
            <p className="text-white mt-2">Happy Clients</p>
          </div>
          
          {/* Articles Written */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-700 bg-opacity-90 flex flex-col items-center justify-center">
              <h2 className="text-primary-orange text-3xl font-bold">
                {inView ? <CountUp end={10000} duration={3} separator="," /> : 0}+
              </h2>
            </div>
            <p className="text-white mt-2">Articles Written</p>
          </div>
          
          {/* Years Experience */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-700 bg-opacity-90 flex flex-col items-center justify-center">
              <h2 className="text-primary-orange text-3xl font-bold">
                {inView ? <CountUp end={3} duration={2} /> : 0}+
              </h2>
            </div>
            <p className="text-white mt-2">Years Experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;