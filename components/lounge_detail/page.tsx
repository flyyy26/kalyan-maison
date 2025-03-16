"use client";

import style from "@/app/[locale]/style/lounge_detail.module.css";
import Image from "next/image";
import ClientSwiper from "@/components/slideLounge/page";
import ContactSection from "@/components/Contact_section/page";
import { Link } from "@/i18n/routing";
import { BsChevronLeft } from "react-icons/bs";
import { useLounge } from "@/hooks/useLounge";
import { useEffect } from "react";

export default function LoungeDetailPage({ loungeDetail, translations }: { loungeDetail: string; translations: { sectionHeading: string; spaces: string } }) {
    const { lounges } = useLounge();
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

    const swiperData = currentLounge.menu.map(item => ({
        image: item.image,
        name: item.name,
        description: item.description
    }));

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
                    <p>{currentLounge.phone}</p>
                </div>
            </div>

            <div className={style.section_2}>
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
            </div>

            <ContactSection />
        </>
    );
}
