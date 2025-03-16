"use client"; // Menandakan bahwa ini adalah komponen client-side

import Image from 'next/image'; // Pastikan untuk mengimpor Image dari Next.js
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Navigation, EffectFade } from 'swiper/modules';
import style from '@/app/[locale]/style/lounge_detail.module.css'

interface Slide {
  image: string;
  name: string; // Menggunakan "name" sesuai dengan data asli
  description: string;
}

interface ClientSwiperProps {
  slides: Slide[];
}

export default function ClientSwiper({ slides }: ClientSwiperProps) {
  if (!slides || slides.length === 0) {
    return <p className={style.no_data}>No slides available</p>; // Jika slides kosong
  }

  return (
    <Swiper
      navigation={true}
      loop={true}
      effect={'fade'}
      modules={[Navigation, EffectFade]}
      className="swiperLounge" // Gunakan style yang lebih terstruktur
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className={style.slide_image}>
            <Image
              src={slide.image}
              alt={`Slide ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={style.heading_slide}>
            <button>{slide.name}</button>
            <p>{slide.description || "100+ Beverage Choices"}</p> {/* Gunakan description jika ada */}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
