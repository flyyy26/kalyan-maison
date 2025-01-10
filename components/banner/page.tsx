'use client'

import React from 'react'
import Image from 'next/image';
import home from "@/app/[locale]/style/home.module.css"
import line from "@/public/images/line_banner.png"
import { HiChevronDown } from "react-icons/hi2";
import { useMenu } from '@/context/MenuContext';
import { useLocationContext } from '@/context/LocationContext'; 
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
// import ContactSection from "@/components/Contact_section/page"
import {useTranslations} from 'next-intl';

export default function Banner() {
    const t =  useTranslations();
  const {
    isOpen,
    hoveredImageId,
    setHoveredImageId,
    hoveredTab,
    setHoveredTab,
    openSelect,
    toggleDropdown,
    activeBannerImage,
    updateActiveBannerImage
  } = useMenu();
  const { locations } = useLocationContext();

  const handleHoverImage = (id: number) => {
    setHoveredImageId(id); // Update the hovered image ID
  };

  const handleHoverTab = (tabId: number) => {
    setHoveredTab(tabId); // Update the hovered tab
    updateActiveBannerImage(tabId, locations); 
  };

  return (
    <div>
      <div className={home.banner} style={{ backgroundImage: `url(${activeBannerImage})` }}> 
        <Image src={line} fill alt="Banner Kalyan Maison" className={home.line}/>
        {locations.map((location) => (
          <div
            key={location.id}
            className={`${home.btn_tab} ${home[location.className]}`}// Tambahkan class posisi
          >
            <Link href={`/our-lounges/${location.slug}`}
              className={`${home.circle} ${
                hoveredTab === location.id ? home.active : ''
              }`} // Tambahkan class jika dihover
              onMouseEnter={() => handleHoverTab(location.id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {hoveredTab === location.id && <span>Visit Branch</span>} {/* Munculkan tulisan */}
            </Link>
            <span
              className={`${home.tab_name} ${
                hoveredTab === location.id ? home.hidden : ''
              }`} // Sembunyikan span jika dihover
            >
              {location.name}
            </span>
          </div>
        ))}
        <div className={`${home.heading_banner} ${hoveredTab ? home.active : ''}`}>
          <span>{t('welcome')}</span>
          <h1 translate="no">Kalyan Maison</h1>
        </div>
        {locations.map((branch) => (
          <div
            key={branch.id}
            className={`${home.detail_branch_banner} ${
              hoveredTab === branch.id ? home.active : ''
            }`} 
          >
            <div className={home.heading_banner_dynamic}>
              <h1>Kalyan Maison {branch.name}</h1>
              <p>{branch.address}</p>
              <p>+62 {branch.phone}</p>
            </div>
            <div className={home.galeri_banner_dynamic}>
              {branch?.images_circle.slice(0, 2).map((image, index) => (
                <div key={index} className={home.galeri_banner_dynamic_box}>
                  <Image src={image} fill alt={`Banner Image ${branch.name}`} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className={home.banner_bottom_content}>
          <div className={home.banner_branch}>
            <div className={`${home.dropdown} ${openSelect ? home.dropdown_active : ''}`}>
              <button onClick={toggleDropdown}>
                Jakarta <HiChevronDown />
              </button>
              <div className={`${home.dropdown_menu} ${openSelect ? home.dropdown_menu_show : ''}`}>
                <button>Bali</button>
              </div>
            </div>
            <div className={`${home.branch_list} ${isOpen ? home.branch_list_active : ''}`}>
              {locations.map((location) => (
                <Link
                  key={location.id}
                  href="/"
                  onMouseEnter={() => handleHoverImage(location.id)} // Set ID saat di-hover
                  onMouseLeave={() => setHoveredImageId(null)}
                >
                  {location.name}
                </Link>
              ))}
            </div>
          </div>
          <div className={home.banner_social_media}>
            <Link href="/">
              <button className={home.banner_social_media_box}>
                <FaInstagram />
              </button>
            </Link>
            <Link href="/">
              <button className={home.banner_social_media_box}>
                <FaFacebook />
              </button>
            </Link>
            <Link href="/">
              <button className={home.banner_social_media_box}>
                <FaTiktok />
              </button>
            </Link>
            <Link href="/">
              <button className={home.banner_social_media_box}>
                <FaWhatsapp />
              </button>
            </Link>
          </div>
          <div className={`${home.image_hover} ${hoveredImageId ? home.image_hover_active : ''}`}>
            {hoveredImageId !== null && (
              <>
                {locations
                  .find(loc => loc.id === hoveredImageId)
                  ?.images_circle.slice(0, 2) // Batasi hanya dua gambar
                  .map((image, index) => (
                    <div key={index} className={home.image_hover_box}>
                      <Image
                        src={image}
                        fill
                        alt={`Image ${index + 1}`}
                      />
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
