'use client'

import style from '@/app/[locale]/style/lounge.module.css'
import home from '@/app/[locale]/style/home.module.css'
import { HiChevronDown } from "react-icons/hi2";
import { useLocationContext } from '@/context/LocationContext'; 
import React, { useState } from 'react';
// Import Swiper React components
import Image from 'next/image';
import { Link } from '@/i18n/routing'; 
import ContactSection from "@/components/Contact_section/page"
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { useTranslations } from 'next-intl';

export default function OurLounges(){
    const t =  useTranslations();
    const { locations } = useLocationContext();
    const [openSelect, setOpenSelect] = useState(false);
    
    const toggleDropdown = () => {
        setOpenSelect(!openSelect); // Toggle dropdown visibility
    };

    return(
        <>
            <div className={style.container_top}>
                <div className={style.banner}>
                    <span>{t('lounge.smallHeading')}</span>
                    <h1>{t('lounge.heading')}</h1>
                    <div className={`${home.dropdown} ${openSelect ? home.dropdown_active : ''}`}>
                        <button onClick={toggleDropdown}>
                            Jakarta <HiChevronDown />
                        </button>
                        <div className={`${home.dropdown_menu} ${home.dropdown_menu_bottom} ${openSelect ? home.dropdown_menu_show : ''}`}>
                            <button>Bali</button>
                        </div>
                    </div>
                </div>
            </div>
            {locations.map((location, index) => (
                <div className={style.lounge_container} key={index}>
                    <div className={style.lounge_slide}>
                        <Swiper
                            slidesPerView={'auto'}
                            spaceBetween={0}
                            loop={true}
                            navigation={true}
                            modules={[Navigation]}
                            className="slideLounge"
                        >
                            {location.gallery.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <div className={style.lounge_image}>
                                        <div className='lounge_image_overlay'></div>
                                        <Image src={image} fill objectFit='cover' alt={`Kalyan Maison ${location.name}`}/>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div
                        className={home.branch_section_page}
                        key={location.id}
                    >
                        <div className={home.branch_layout}>
                        <button className={home.branch_heading}>{location.name}</button>
                        <div className={home.branch_detail_layout}>
                            <p className={home.address_content}>{location.address}</p>
                            <div className={home.branch_time}>
                            <span>{location.day}</span>
                            <p>{location.time}</p>
                            </div>
                        </div>
                        <div className={home.branch_phone}>
                            <p>+62 {location.phone}</p>
                        </div>
                        </div>
                        <div className={home.branch_layout}>
                        <div className={home.branch_button}>
                            <Link href={`/our-lounges/${location.slug}`}><button>{t('home.explore')}</button></Link>
                            <Link href="/"><button>Menu</button></Link>
                        </div>
                        </div>
                    </div>
                </div>
            ))}
            <ContactSection/>
        </> 
    );
}