'use client'

import React from 'react'
// import Image from 'next/image';
import home from "@/app/[locale]/style/home.module.css"
// import line from "@/public/images/line_banner.png"
// import { HiChevronDown } from "react-icons/hi2";
// import { useMenu } from '@/context/MenuContext';
import { useLocationContext } from '@/context/LocationContext'; 
import { Link } from '@/i18n/routing';
// import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
// import ContactSection from "@/components/Contact_section/page"
import {useTranslations} from 'next-intl';

const ListLounge = () => {
  const t =  useTranslations("home");
  const { locations } = useLocationContext();
  return (
    <>
      <div className={home.section_2}>
        <div className={home.section_2_content}>
          <h1>{t('unique')}</h1>
          <p>{t('uniqueDesc')}</p>
        </div>
      </div>
      {locations.map((location, index) => (
        index % 2 === 0 ? (
          <div
            className={home.branch_section}
            key={location.id}
            style={{
              background: `url(${location.section_image.slice(0, 1)}), linear-gradient(179.66deg, rgba(26, 26, 26, 0) 0.29%,rgba(26, 26, 26, 0.29) 63.24%)`
            }}
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
                <Link href={`/our-lounges/${location.slug}`}><button>{t('explore')}</button></Link>
                <Link href="/"><button>Menu</button></Link>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${home.branch_section} ${home.branch_section_2}`}
            key={location.id}
            style={{
              background: `url(${location.section_image.slice(0, 1)}), linear-gradient(179.66deg, rgba(26, 26, 26, 0) 0.29%,rgba(26, 26, 26, 0.29) 63.24%)`
            }}
          >
            <div className={home.branch_layout}>
              <div className={home.branch_button}>
                <Link href={`/our-lounges/${location.slug}`}><button>{t('explore')}</button></Link>
                <Link href="/"><button>Menu</button></Link>
              </div>
            </div>
            <div className={`${home.branch_layout} ${home.branch_layout_right}`}>
              <button className={home.branch_heading}>{location.name}</button>
              <div className={home.branch_detail_layout_2}>
                <div className={home.branch_time}>
                  <span>{location.day}</span>
                  <p>{location.time}</p>
                </div>
                <p className={home.address_content}>{location.address}</p>
              </div>
              <div className={home.branch_phone}>
                <p>+62 {location.phone}</p>
              </div>
            </div>
          </div>
        )
      ))}
    </>
  )
}

export default ListLounge
