import React from 'react';
import Image from 'next/image';

const WhyChooseImages = () => {
  const images = [
    { src: '/images/whychoose1.jpg', alt: 'Feature 1' },
    { src: '/images/whychoose2.png', alt: 'Feature 2' },
    { src: '/images/whychoose3.png', alt: 'Feature 3' },
    { src: '/images/whychoose4.jpeg', alt: 'Feature 4' },
    { src: '/images/whychoose5.jpeg', alt: 'Feature 5' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-square overflow-hidden rounded-lg shadow-sm  transition-shadow duration-300"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
              draggable={false} // Prevent dragging
              onContextMenu={(e) => e.preventDefault()} // Disables right-click
              loading='lazy'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseImages;