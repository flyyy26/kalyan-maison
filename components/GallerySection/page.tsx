"use client"

import home from "@/app/[locale]/style/home.module.css";
import React, { useEffect, useRef } from 'react';
import Image from "next/image";
import { useGallery } from "@/hooks/useGallery";

import { IoCloseOutline } from "react-icons/io5";

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

type MediaItem = {
    type: "image" | "video";
    src: string;
};  

export default function GallerySection(){
    const { galleriesDetail } = useGallery();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const marqueeRef1 = useRef<HTMLDivElement>(null);
    const marqueeRef2 = useRef<HTMLDivElement>(null);

    const [duration1, ] = React.useState('30s');
    const [duration2, ] = React.useState('30s');

    const dynamicMedia: MediaItem[] = [
        ...(galleriesDetail?.imageGallery || []).map((url) => ({
          type: "image" as const,
          src: url as string,
        })),
        ...(galleriesDetail?.videoGallery || []).map((url) => ({
          type: "video" as const,
          src: url as string,
        })),
      ];

      console.log('galeri', dynamicMedia)

    const half = Math.ceil(dynamicMedia.length / 2);
    const mediaFirst = dynamicMedia.slice(0, half);
    const mediaSecond = dynamicMedia.slice(half);

    useEffect(() => {
        const updateScrollVars = () => {
          if (marqueeRef1.current) {
            const scrollWidth = marqueeRef1.current.scrollWidth;
            marqueeRef1.current.style.setProperty('--scroll-width', (scrollWidth / 100).toString()); // sesuaikan skala
          }
          if (marqueeRef2.current) {
            const scrollWidth = marqueeRef2.current.scrollWidth;
            marqueeRef2.current.style.setProperty('--scroll-width', (scrollWidth / 100).toString());
          }
        };
      
        updateScrollVars();
        window.addEventListener('resize', updateScrollVars);
      
        return () => {
          window.removeEventListener('resize', updateScrollVars);
        };
    }, []); 
      
    return(
        <>
             <div className={home.gallerySection} id="gallery">
                <div className={home.marqueeContainer}>
                    <div className={home.marqueeContent} ref={marqueeRef1} style={{ animationDuration: duration1 }}>
                        {[...mediaFirst, ...mediaFirst].map((item, i) => (
                        <div className={home.imageBox} key={`first-${i}`} style={{ cursor: 'pointer' }}  onClick={() => {
                            setActiveIndex(i % mediaFirst.length);
                            setIsModalOpen(true);
                          }}> 
                            {item.type === 'image' ? (
                            <Image
                                src={item.src}
                                alt={`Image ${i}`}
                                width={800}
                                height={800}
                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            />
                            ) : (
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            >
                                <source src={typeof item.src === 'string' ? item.src : item.src} type="video/mp4" />
                            </video>
                            )}
                        </div>
                        ))}
                    </div>
                </div>

                <div className={home.marqueeContainerSecond}>
                    <div className={home.marqueeContentSecond} ref={marqueeRef2} style={{ animationDuration: duration2 }}>
                        {[...mediaSecond, ...mediaSecond].map((item, i) => (
                        <div className={home.imageBoxSecond} key={`second-${i}`} style={{ cursor: 'pointer' }}  onClick={() => {
                            setActiveIndex(half + (i % mediaSecond.length));
                            setIsModalOpen(true);
                          }}>
                            {item.type === 'image' ? (
                            <Image
                                src={item.src}
                                alt={`Image ${i}`}
                                width={800}
                                height={800}
                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            />
                            ) : (
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            >
                                <source src={typeof item.src === 'string' ? item.src : item.src} type="video/mp4" />
                            </video>
                            )}
                        </div>
                        ))}
                    </div>
                </div>

            </div>

            {isModalOpen && (
            <div className={home.modalOverlay} onClick={() => setIsModalOpen(false)}>
                <div className={home.close_gallery_popup} onClick={() => setIsModalOpen(false)}><IoCloseOutline/></div>
                <div className={home.modalContent} onClick={e => e.stopPropagation()}>
                <Swiper
                    initialSlide={activeIndex}
                    navigation
                    loop={true}
                    modules={[Navigation]}
                    className="popupSwiper"
                >
                    {dynamicMedia.map((item, idx) => (
                    <SwiperSlide key={idx}>
                        <div className={home.gallery_box_popup}>
                        {item.type === 'image' ? (
                                <Image
                                    src={item.src}
                                    alt={`Popup Image ${idx}`}
                                    width={800}
                                    height={800}
                                />
                        ) : (
                                <video
                                    controls
                                >
                                    <source src={typeof item.src === 'string' ? item.src : item.src} type="video/mp4" />
                                </video>
                        )}
                        </div>
                    </SwiperSlide>
                    ))}
                </Swiper>
                </div>
            </div>
            )}

        </>
    );
}