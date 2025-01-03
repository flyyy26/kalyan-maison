"use client"; // Menandakan bahwa ini adalah komponen client-side

import Image from 'next/image'; // Pastikan untuk mengimpor Image dari Next.js
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Navigation, EffectFade } from 'swiper/modules';
import style from '@/app/style/lounge_detail.module.css'

interface ClientSwiperProps {
    slides: string[]; // Array data gambar yang akan dipetakan ke dalam slide
}

const ClientSwiper: React.FC<ClientSwiperProps> = ({ slides }) => {
  return (
    <Swiper navigation={true} loop={true} effect={'fade'} modules={[Navigation,EffectFade]} className="swiperLounge">
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className={style.slide_image}>
            <Image
              src={slide}
              alt={`Slide ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ClientSwiper;
