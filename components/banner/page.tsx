'use client'

import React from 'react'
import Image from 'next/image';
import home from "@/app/[locale]/style/home.module.css"
import line from "@/public/images/line_banner.png"
import lineDekstop from "@/public/images/circle_dekstop.png"
import { HiChevronDown } from "react-icons/hi2";
import { useMenu } from '@/context/MenuContext';
import { useLocationContext } from '@/context/LocationContext'; 
import { Link } from '@/i18n/routing';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import {useTranslations} from 'next-intl';
import { useEffect, useState } from 'react';
import {useContact} from '@/hooks/useContact'
import { useCity } from '@/hooks/useCity';

export default function Banner() {
    const t =  useTranslations();
  const {
    isOpen,
    hoveredImageId,
    setHoveredImageId,
    hoveredTab,
    setHoveredTab,
    activeBannerImage,
    updateActiveBannerImage
  } = useMenu();
  const { loungesFe } = useLocationContext();

  const { ContactDetail } = useContact();

  const { cities } = useCity();
  
      const [selectedCity, setSelectedCity] = useState<string | null>(null);
      const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
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

      const filteredLounges = loungesFe.filter((location) => location.city === selectedCityId);
      
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

  const handleHoverImage = (tabId: number) => {
    setHoveredImageId(tabId); // Update the hovered image ID
  };

  const handleHoverTab = (tabId: number) => {
    setHoveredTab(tabId); // Update the hovered tab
    updateActiveBannerImage(tabId, loungesFe); 
  };

  useEffect(() => {
    updateActiveBannerImage(hoveredTab, loungesFe);
}, [hoveredTab, loungesFe, updateActiveBannerImage]);


  return (
    <div>
      <div className={home.banner} style={{ backgroundImage: `url(${activeBannerImage})` }}> 
        <Image src={line} fill alt="Banner Kalyan Maison" className={home.line}/>
        <Image src={lineDekstop} width={800} height={800} alt="Banner Kalyan Maison" className={home.line_dekstop}/>
        {filteredLounges.map((lounge, index) => (
          <div
            key={lounge._id}
            className={`${home.btn_tab} ${
              filteredLounges.length === 1
                ? home.btn_tab_center
                : index === 0
                ? home.btn_tab_left
                : index === 1
                ? home.btn_tab_right
                : index === 2
                ? home.btn_tab_bottom
                : ''
            }`}
          >
            <Link
              href={`/our-lounges/${lounge.slug}`}
              className={`${home.circle} ${
                hoveredTab === lounge._id ? home.active : ''
              }`}
              onMouseEnter={() => handleHoverTab(lounge._id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {hoveredTab === lounge._id && <span>Visit Branch</span>}
            </Link>
            <span
              className={`${home.tab_name} ${
                hoveredTab === lounge._id ? home.hidden : ''
              }`}
            >
              {lounge.name}
            </span>
          </div>
        ))}
        <div className={`${home.heading_banner} ${hoveredTab ? home.active : ''}`}>
          <span>{t('welcome')}</span>
          <h1 translate="no">Kalyan Maison</h1>
        </div>
        {loungesFe.map((lounge) => (
          <div
            key={lounge._id}
            className={`${home.detail_branch_banner} ${
              hoveredTab === (lounge._id) ? home.active : ''
            }`}  
          >
            <div className={home.heading_banner_dynamic}>
              <h1>Kalyan Maison {lounge.name}</h1>
              <p>{lounge.address}</p> 
              <p> {lounge.phone}</p>
            </div>
            <div className={home.galeri_banner_dynamic}>
              {lounge.spaces.slice(0, 2).map((image: { image: string }, index: number) => (
                <div key={index} className={home.galeri_banner_dynamic_box}>
                  <Image src={image.image} fill alt={`Banner Image ${lounge.name}`} style={{objectFit: 'cover'}} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className={`${home.banner_bottom_content} ${isOpen ? home.banner_bottom_content_active : ''}`}>
          <div className={home.banner_branch}>
            <div className={`${home.dropdown} ${openSelect ? home.dropdown_active : ''}`}>
              <button onClick={toggleDropdown}>
                {selectedCity || "Pilih Kota"}  <HiChevronDown /> 
              </button>
              <div className={`${home.dropdown_menu} ${openSelect ? home.dropdown_menu_show : ''}`}>
                  {cities
                  .filter((city) => city.name !== selectedCity) 
                  .map((city) => (
                      <button key={city._id} onClick={() => handleCityChange(city.name, city._id)}>
                          {city.name}
                      </button>
                  ))}
              </div>
            </div>
            <div className={`${home.branch_list} ${isOpen ? home.branch_list_active : ''}`}>
                {filteredLounges.map((lounge) => (
                <Link
                  key={lounge._id}
                  href="/"
                  onMouseEnter={() => handleHoverImage(lounge._id)} // Set ID saat di-hover
                  onMouseLeave={() => setHoveredImageId(null)}
                >
                  {lounge.name}
                </Link>
                ))}
            </div>
          </div>
          <div className={home.banner_social_media}>
            <Link href={`${ContactDetail.instagram}`} target='blank_'>
              <button className={home.banner_social_media_box}>
                <FaInstagram />
              </button>
            </Link>
            <Link href={`${ContactDetail.facebook}`} target='blank_'>
              <button className={home.banner_social_media_box}>
                <FaFacebook />
              </button>
            </Link>
            <Link href={`${ContactDetail.tiktok}`} target='blank_'>
              <button className={home.banner_social_media_box}>
                <FaTiktok />
              </button>
            </Link>
            <Link href={`https://api.whatsapp.com/send?phone=${ContactDetail.whatsapp}`} target='blank_'>
              <button className={home.banner_social_media_box}>
                <FaWhatsapp />
              </button>
            </Link>
          </div>
          <div className={`${home.image_hover} ${hoveredImageId ? home.image_hover_active : ''}`}>
            {hoveredImageId !== null && (
              <>
                {loungesFe
                  .find(loc => (loc._id) === hoveredImageId)
                  ?.spaces.slice(0, 2) // Batasi hanya dua gambar
                  .map((image, index) => (
                    <div key={index} className={home.image_hover_box}>
                      <Image
                        src={image.image}
                        fill
                        alt={`Image ${image.name}`}
                      />
                      haiiii
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
