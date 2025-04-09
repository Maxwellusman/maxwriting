'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';

const companyLogos = [
    '/images/companylogo1.jpg',
    '/images/companylogo2.png',
    '/images/companylogo3.jpg',
    '/images/companylogo1.jpg',
    '/images/companylogo2.png',
    '/images/companylogo3.jpg',
    '/images/companylogo1.jpg',
    '/images/companylogo2.png',
    '/images/companylogo3.jpg',
];

const CompanyLogosSwiper: React.FC = () => {
    return (
        <div className="w-full py-10">
            <Swiper
                modules={[Autoplay]}
                slidesPerView={6} // Show 6 logos at a time
                spaceBetween={30}
                loop={true} // Ensures smooth infinite looping
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                speed={1000} // Smooth animation speed
                className="flex items-center"
            >
                {companyLogos.map((logo, index) => (
                    <SwiperSlide key={index} className="flex justify-center w-auto">
                        <Image
                            src={logo}
                            alt={`Company Logo ${index + 1}`}
                            width={120}
                            height={50}
                            className="grayscale hover:grayscale-0 transition-all duration-300"
                            priority={false}
                            draggable={false} // Prevent dragging
                            onContextMenu={(e) => e.preventDefault()} // Disables right-click
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CompanyLogosSwiper;
