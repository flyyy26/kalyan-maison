'use client'

import style from '@/app/[locale]/style/lounge.module.css'
import home from '@/app/[locale]/style/home.module.css'
import { HiChevronDown } from "react-icons/hi2";
import { useLocationContext } from '@/context/LocationContext'; 
import React, { useState, useEffect } from 'react';
// Import Swiper React components
// import Image from 'next/image';
// import { Link } from '@/i18n/routing'; 
import ContactSection from "@/components/Contact_section/page"
// import { Swiper, SwiperSlide } from 'swiper/react';
import { useCity } from '@/hooks/useCity';

import 'swiper/css';
import 'swiper/css/navigation';

// import { Navigation } from 'swiper/modules';
import { useTranslations } from 'next-intl';
import LoadingPopup from '@/components/loading_popup/page';

export default function OurLounges() {
    const t = useTranslations();
    const { loungesFe } = useLocationContext();
    const { cities } = useCity();

    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [, setSelectedCityId] = useState<string | null>(null);
    const [openSelect, setOpenSelect] = useState(false);

    useEffect(() => {
        if (cities.length > 0 && !selectedCity) {
            setSelectedCity(cities[0].name); 
            setSelectedCityId(cities[0]._id); // Simpan ID kota yang dipilih
        }
    }, [cities, selectedCity]);

    const toggleDropdown = () => setOpenSelect(!openSelect);

    const handleCityChange = (cityName: string, cityId: string) => {
        setSelectedCity(cityName);
        setSelectedCityId(cityId);
        setOpenSelect(false);
    };

    // Filter lounges berdasarkan city ID yang dipilih
    // const filteredLounges = loungesFe.filter((location) => location.city === selectedCityId);

    useEffect(() => {
        if (cities.length > 0) {
            // Cari kota pertama yang memiliki lounge
            const cityWithLounge = cities.find(city => 
                loungesFe.some(lounge => lounge.city === city._id)
            );
    
            if (cityWithLounge) {
                setSelectedCity(cityWithLounge.name);
                setSelectedCityId(cityWithLounge._id);
            } else {
                // Jika tidak ada kota dengan lounge, pilih kota pertama secara default
                setSelectedCity(cities[0].name);
                setSelectedCityId(cities[0]._id);
            }
        }
    }, [cities, loungesFe]);
    

    return ( 
        <>
            <LoadingPopup duration={700} />
            <div className={style.container_top}>
                <div className={style.banner}>
                    <span>{t('lounge.smallHeading')}</span>
                    <h1>{t('lounge.heading')}</h1>
                    <div className={`${home.dropdown} ${openSelect ? home.dropdown_active : ""}`}>
                        <button onClick={toggleDropdown}>
                            {selectedCity || "Pilih Kota"} <HiChevronDown />
                        </button>
                        <div className={`${home.dropdown_menu} ${home.dropdown_menu_bottom} ${openSelect ? home.dropdown_menu_show : ""}`}>
                            {cities
                                .filter((city) => city.name !== selectedCity) 
                                .map((city) => (
                                    <button key={city._id} onClick={() => handleCityChange(city.name, city._id)}>
                                        {city.name}
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            <ContactSection />
        </> 
    );
}