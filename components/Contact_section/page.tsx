'use client'
import React from 'react'
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import home from "@/app/[locale]/style/home.module.css"
import {useTranslations} from 'next-intl';
import {useContact} from '@/hooks/useContact'

const ContactSection = () => {
  const { ContactDetail } = useContact();
  const t =  useTranslations("contactSection");
  return (
    <>
      <div className={home.section_contact}>
        <div className={home.contact_container}>
          <div className={home.contact_layout}>
            <h1 className={home.heading_contact}>{t('heading')}</h1>
            <p>{t('desc')}</p>
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
          </div>
          <div className={home.contact_layout}>
              <div className={home.contact_button}>
                <Link href={`https://api.whatsapp.com/send?phone=${ContactDetail.whatsapp}`} target='blank_'><button>{t('contact_wa')}</button></Link>
                <Link href={`${ContactDetail.instagram}`} target='blank_'><button>{t('contact_ig')}</button></Link>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactSection
