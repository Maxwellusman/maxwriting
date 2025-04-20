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
    <div className="relative py-10 md:py-16 w-full min-h-screen flex items-center px-4">
      {/* Background Image */}
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
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Content Container */}
      <div className='maxwellClass'>
        <div className="relative z-10 w-full mx-auto  max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
              <h1 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
                Best Writing Services
              </h1>
              <p className="text-white font-Poppins text-[16px] md:text-[18px] mt-4  mx-auto font-bold tracking-wide">
                We at Max Writings® aim to build high-quality SEO-optimized articles to help your website rank on Google's first page and grow your business.
              </p>

              {/* Stats */}
              <div ref={ref} className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 justify-center items-start">
                {/* Happy Clients */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="45" fill="none" stroke="#f97316" strokeWidth="8"
                        strokeLinecap="round" strokeDasharray="283"
                        strokeDashoffset={inView ? "283" : "0"}
                        style={{
                          transition: 'stroke-dashoffset 2s ease-in-out',
                          strokeDashoffset: inView ? "0" : "283"
                        }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <h2 className="text-primary-orange text-2xl md:text-3xl font-bold">
                        {inView ? <CountUp end={99} duration={2} /> : 0}+
                      </h2>
                      <p className="text-white text-xs md:text-sm mt-1 font-[500]">Happy Clients</p>
                    </div>
                  </div>
                </div>

                {/* Articles Written */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="45" fill="none" stroke="#f97316" strokeWidth="8"
                        strokeLinecap="round" strokeDasharray="283"
                        strokeDashoffset={inView ? "283" : "0"}
                        style={{
                          transition: 'stroke-dashoffset 3s ease-in-out',
                          strokeDashoffset: inView ? "0" : "283"
                        }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <h2 className="text-primary-orange text-2xl md:text-3xl font-bold">
                        {inView ? <CountUp end={10000} duration={3} separator="," /> : 0}+
                      </h2>
                      <p className="text-white text-xs md:text-sm mt-1 font-[500]">Articles Written</p>
                    </div>
                  </div>
                </div>

                {/* Years Experience */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="45" fill="none" stroke="#f97316" strokeWidth="8"
                        strokeLinecap="round" strokeDasharray="283"
                        strokeDashoffset={inView ? "283" : "0"}
                        style={{
                          transition: 'stroke-dashoffset 2s ease-in-out',
                          strokeDashoffset: inView ? "0" : "283"
                        }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <h2 className="text-primary-orange text-2xl md:text-3xl font-bold">
                        {inView ? <CountUp end={3} duration={2} /> : 0}+
                      </h2>
                      <p className="text-white text-xs md:text-sm mt-1 font-[500]">Years Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image on the right */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src="/images/bannerimage.jpg" // Replace with your image path
                  alt="Writing Services Illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;