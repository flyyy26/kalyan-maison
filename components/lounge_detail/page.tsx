"use client";

import style from "@/app/[locale]/style/lounge_detail.module.css";
import Image from "next/image";
import ContactSection from "@/components/Contact_section/page";
import { Link } from "@/i18n/routing";
import { BsChevronLeft } from "react-icons/bs";
import { useLounge } from "@/hooks/useLounge";
import { useEffect } from "react";
import GallerySection from "../GallerySection/page";
import home from "@/app/[locale]/style/home.module.css"
import {useContact} from '@/hooks/useContact'
import { IoLogoYoutube } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import northLogo from "@/public/images/north_logo.png"
import menu_one from "@/public/images/menu_1.png"
import menu_two from "@/public/images/menu_2.png"
import menu_three from "@/public/images/menu_3.png"
import menu_four from "@/public/images/menu_4.png"
import menu_five from "@/public/images/menu_5.png"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination, Mousewheel, Keyboard } from 'swiper/modules';

export default function LoungeDetailPage({ loungeDetail }: { loungeDetail: string; translations: { sectionHeading: string; spaces: string } }) {
    const { lounges } = useLounge();
    const { ContactDetail } = useContact();
    const [menuCover, setMenuCover] = useState(true);
    const currentLounge = lounges.find((lounge) => lounge.slug === loungeDetail);
    const filteredLocations = lounges.filter((lounge) => lounge.slug !== loungeDetail);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const scrollToHash = () => {
                setTimeout(() => {
                    const hash = window.location.hash;
                    if (hash === "#menu") {
                        const element = document.getElementById("menu");
                        if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                        }
                    }
                }, 500); // Tambahkan delay agar elemen siap sebelum scroll
            };
    
            // Jalankan saat pertama kali halaman dimuat
            scrollToHash();
    
            // Gunakan MutationObserver untuk mendeteksi perubahan di DOM
            const observer = new MutationObserver(() => {
                scrollToHash();
            });
    
            observer.observe(document.body, { childList: true, subtree: true });
    
            return () => observer.disconnect();
        }
    }, []);
        

    if (!currentLounge) {
        return <h1>Blog not found</h1>;
    }

    // const swiperData = currentLounge.menu.map(item => ({
    //     image: item.image,
    //     name: item.name,
    //     description: item.description
    // }));

    return (
        <>
        
            <div className={style.banner} style={{ background: `url(${currentLounge.banner}` }}>
                <div className={style.location_arrow}>
                    {filteredLocations.slice(0, 2).map((location_item) => (
                        <Link href={`/our-lounges/${location_item.slug}`} className={style.next_lounge} key={location_item._id}>
                            <BsChevronLeft /> {location_item.name}
                        </Link>
                    ))}
                </div>
                <div className={style.heading_banner}>
                    <h1>Kalyan Maison {currentLounge.name}</h1>
                    <p>{currentLounge.address}</p>
                    <div className={home.banner_social_media}>
                        <Link href={`${ContactDetail.instagram}`} target='blank_'>
                            <button className={home.banner_social_media_box}>
                            <FaInstagram />
                            </button>
                        </Link>
                        <Link href={`${ContactDetail.facebook}`} target='blank_'>
                            <button className={home.banner_social_media_box}>
                            <IoLogoYoutube />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className={style.menu_container}>
                <div className={style.menu_heading}>
                    <h2>Menu</h2>
                    <p>Have a look at our menu in Kalyan Maison Gunawarman.</p>
                </div>
                <div className={style.menu_layout}>
                    <div className={`${style.cover_img} ${menuCover ? style.active : ''}`}>
                        <Image
                        src={northLogo}
                        width={800}
                        height={800}
                        alt="Menu North"
                        style={{ height: 'auto', objectFit: 'cover' }}
                        />
                        <button onClick={() => setMenuCover(false)}>Open Menu</button>
                    </div>
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
                        mousewheel={true}
                        keyboard={true}
                        cssMode={true}
                        pagination={{
                        clickable: true,
                        }}
                        modules={[Pagination, Mousewheel, Keyboard]}
                        className="menuSwiper"
                    >
                        <SwiperSlide>
                            <div className={style.menu_box_img}>
                                <Image src={menu_one} alt="Menu North" width={800} height={800} style={{height: 'auto', objectFit: 'cover'}} />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={style.menu_box_img}>
                                <Image src={menu_two} alt="Menu North" width={800} height={800} style={{height: 'auto', objectFit: 'cover'}} />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={style.menu_box_img}>
                                <Image src={menu_three} alt="Menu North" width={800} height={800} style={{height: 'auto', objectFit: 'cover'}} />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={style.menu_box_img}>
                                <Image src={menu_four} alt="Menu North" width={800} height={800} style={{height: 'auto', objectFit: 'cover'}} />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={style.menu_box_img}>
                                <Image src={menu_five} alt="Menu North" width={800} height={800} style={{height: 'auto', objectFit: 'cover'}} />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>

            {/* <div className={style.section_2}>
                <h1>{translations.sectionHeading}</h1>
                <div className={style.section_2_img}>
                    <Image src={currentLounge.spaces?.[0].image} fill objectFit="cover" alt={`Kalyan Maison ${currentLounge.name}`} />
                </div>
            </div>

            <div className={style.section_3} id="menu">
                <ClientSwiper slides={swiperData} />
            </div>

            <div className={style.section_4}>
                <div className={style.section_4_heading}>
                    <h1>{translations.spaces}</h1>
                </div>
                <div className={style.section_4_layout}>
                    {currentLounge.spaces.map((image, index) => ( // Batasi hanya 2 gambar
                        <div className={style.spaces_box} key={index}>
                            <Image src={image.image} fill objectFit="cover" alt={`Kalyan Maison ${currentLounge.name}`} />
                        </div>
                    ))}
                </div>
            </div> */}

            <GallerySection />

            <ContactSection />
        </>
    );
}
