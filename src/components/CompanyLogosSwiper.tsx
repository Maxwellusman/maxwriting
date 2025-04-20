'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';

const companyLogos = [
    '/clientlogos/00e02Ss3KiOLKE7Ivb8SQ0P-1..v1632757092.png',
    '/clientlogos/1.png',
    '/clientlogos/460x0w.png',
    '/clientlogos/1736145265866.jfif',
    '/clientlogos/download.png',
    '/clientlogos/glamnilogo.png',
    '/clientlogos/images_2.png',
    '/clientlogos/images.png',
    '/clientlogos/jhkj.png',
    '/clientlogos/sda.png',
    '/clientlogos/Xian-MPM-Import-And-Export-Trading-Co-e1662778366204-1536x1104.png',
    '/clientlogos/大和新loggo.gif',
];

const CompanyLogosSwiper: React.FC = () => {
    return (
        <div className="w-full py-10">
            <Swiper
                modules={[Autoplay]}
                slidesPerView={6} // Default number of logos
                spaceBetween={30}
                loop={true}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                speed={1000}
                centeredSlides={true} // This centers all slides
                breakpoints={{
                    // when window width is >= 320px
                    320: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                    // when window width is >= 768px
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 30
                    },
                    // when window width is >= 1024px
                    1024: {
                        slidesPerView: 6,
                        spaceBetween: 30
                    }
                }}
                className="flex justify-center items-center"
            >
                {companyLogos.map((logo, index) => (
                    <SwiperSlide key={index} className="flex justify-center items-center h-full">
                        <div className="flex items-center justify-center h-full w-full px-2"> {/* Added padding for better spacing */}
                            <Image
                                src={logo}
                                alt={`Company Logo ${index + 1}`}
                                width={120}
                                height={50}
                                className="grayscale hover:grayscale-0 transition-all duration-300 object-contain max-h-[50px] w-auto"
                                priority={false}
                                draggable={false}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CompanyLogosSwiper;