import React from 'react'
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import home from "@/app/[locale]/style/home.module.css"
import {useTranslations} from 'next-intl';

const page = () => {
  const t =  useTranslations("contactSection");
  return (
    <>
      <div className={home.section_contact}>
        <div className={home.contact_container}>
          <div className={home.contact_layout}>
            <h1 className={home.heading_contact}>{t('heading')}</h1>
            <p>{t('desc')}</p>
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
          </div>
          <div className={home.contact_layout}>
              <div className={home.contact_button}>
                <Link href="/"><button>{t('contact_wa')}</button></Link>
                <Link href="/"><button>{t('contact_ig')}</button></Link>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
