"use client"

import home from "@/app/[locale]/style/home.module.css";
import React, { useEffect, useRef } from 'react';
import Image, { StaticImageData } from "next/image";

import Image1 from "@/public/images/homeGallery_1.png"
import Image2 from "@/public/images/homeGallery_2.png"
import Image3 from "@/public/images/homeGallery_3.png"
import Image4 from "@/public/images/homeGallery_4.png"
import Image5 from "@/public/images/galeri_2.png"
import Image6 from "@/public/images/galeri_3.png"
import Image7 from "@/public/images/galeri_4.png"

type MediaItem = {
    type: 'image' | 'video';
    src: string | StaticImageData;
  };

  const media: MediaItem[] = [
    { type: 'image', src: Image1 },
    { type: 'video', src: '/video/video.mp4' },
    { type: 'image', src: Image2 },
    { type: 'image', src: Image3 },
    { type: 'image', src: Image4 },
    { type: 'image', src: Image5 },
    { type: 'image', src: Image6 },
    { type: 'image', src: Image7 },
];

const half = Math.ceil(media.length / 2);
const mediaFirst = media.slice(0, half);
const mediaSecond = media.slice(half);

export default function GallerySection(){

    const marqueeRef1 = useRef<HTMLDivElement>(null);
    const marqueeRef2 = useRef<HTMLDivElement>(null);

    const [duration1, setDuration1] = React.useState('30s');
    const [duration2, setDuration2] = React.useState('30s');

    useEffect(() => {
    if (marqueeRef1.current) {
        const scrollWidth = marqueeRef1.current.scrollWidth;
        setDuration1(`${scrollWidth * 0.01}s`); // Adjust multiplier as needed
    }
    if (marqueeRef2.current) {
        const scrollWidth = marqueeRef2.current.scrollWidth;
        setDuration2(`${scrollWidth * 0.01}s`);
    }
    }, []); 
      
    return(
        <>
             <div className={home.gallerySection}>
             <div className={home.marqueeContainer}>
                <div className={home.marqueeContent} ref={marqueeRef1} style={{ animationDuration: duration1 }}>
                    {[...mediaFirst, ...mediaFirst].map((item, i) => (
                    <div className={home.imageBox} key={`first-${i}`}>
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
                            <source src={typeof item.src === 'string' ? item.src : item.src.src} type="video/mp4" />
                        </video>
                        )}
                    </div>
                    ))}
                </div>
                </div>

                <div className={home.marqueeContainerSecond}>
                <div className={home.marqueeContentSecond} ref={marqueeRef2} style={{ animationDuration: duration2 }}>
                    {[...mediaSecond, ...mediaSecond].map((item, i) => (
                    <div className={home.imageBoxSecond} key={`second-${i}`}>
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
                            <source src={typeof item.src === 'string' ? item.src : item.src.src} type="video/mp4" />
                        </video>
                        )}
                    </div>
                    ))}
                </div>
                </div>

            </div>

        </>
    );
}