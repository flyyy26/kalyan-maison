"use client";

import style from "@/app/[locale]/style/lounge_detail.module.css";
import Image from "next/image";
import ContactSection from "@/components/Contact_section/page";
import { Link } from "@/i18n/routing";
import { BsChevronLeft } from "react-icons/bs";
import { useLounge } from "@/hooks/useLounge";
import { useEffect } from "react";
import GallerySection from "../GallerySection/page";
import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { IoLogoYoutube, IoLogoWhatsapp } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import home from "@/app/[locale]/style/home.module.css"


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation, Mousewheel, Keyboard } from 'swiper/modules';

export default function LoungeDetailPage({ loungeDetail, translations }: { loungeDetail: string; translations: { sectionHeading: string; spaces: string; reservation: string; menu: string; descMenu: string; openMenu: string; } }) {
    const { lounges } = useLounge();
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
                    <Link href={`/reservation`}><button>{translations.reservation}</button></Link>
                </div>
                <div className={style.social_lounge_detail}>
                    {currentLounge.instagram !== 'undefined' && (
                    <Link href={currentLounge.instagram} target="_blank">
                        <button className={home.banner_social_media_box}>
                        <FaInstagram />
                        </button>
                    </Link>
                    )}

                    {currentLounge.youtube !== 'undefined' && (
                    <Link href={currentLounge.youtube} target="_blank">
                        <button className={home.banner_social_media_box}>
                        <IoLogoYoutube />
                        </button>
                    </Link>
                    )}

                    {currentLounge.whatsapp !== 'undefined' && (
                    <Link href={`https://api.whatsapp.com/send?phone=${currentLounge.whatsapp}`} target="_blank">
                        <button className={home.banner_social_media_box}>
                        <IoLogoWhatsapp />
                        </button>
                    </Link>
                    )}

                    {currentLounge.email !== 'undefined' && (
                    <Link href={`mailto:${currentLounge.email}`} target="_blank">
                        <button className={home.banner_social_media_box}>
                        <MdEmail />
                        </button>
                    </Link>
                    )}

                    {currentLounge.facebook !== 'undefined' && (
                    <Link href={currentLounge.facebook} target="_blank">
                        <button className={home.banner_social_media_box}>
                        <FaFacebook />
                        </button>
                    </Link>
                    )}
                </div>
            </div>

            <div className={style.menu_container}>
                <div className={style.menu_heading}>
                    <h2>{translations.menu}</h2>
                    <p>{translations.descMenu} Kalyan Maison {currentLounge.name}.</p>
                </div>
                <div className={style.menu_layout}>
                    <div className={`${style.cover_img} ${menuCover ? style.active : ''}`}>
                    {typeof currentLounge.logo === "string" && (
                        <Image
                        src={currentLounge.logo}
                        width={800}
                        height={800}
                        alt="Logo Kalyan Maison"
                        style={{ height: 'auto', objectFit: 'cover' }}
                        />
                    )}
                        <button onClick={() => setMenuCover(false)}>{translations.openMenu}</button>
                    </div>
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
                        navigation={true}
                        mousewheel={true}
                        keyboard={true}
                        cssMode={true}
                        modules={[Mousewheel, Keyboard, Navigation]}
                        className="menuSwiper"
                    >
                        {currentLounge?.menuImages?.map((imageUrl, index) => (
                            <SwiperSlide key={index}>
                                <div className={style.menu_box_img}>
                                <Image
                                    src={imageUrl}
                                    alt={`Menu ${index}`}
                                    width={800}
                                    height={800}
                                    style={{ height: 'auto', objectFit: 'cover' }}
                                />
                                </div>
                            </SwiperSlide>
                            ))}

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
