'use client'
import React from 'react'
import Link from 'next/link';
import home from "@/app/[locale]/style/home.module.css"
import {useTranslations} from 'next-intl';
import {useContact} from '@/hooks/useContact'
import { IoLogoYoutube } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";

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
                  <IoLogoYoutube />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactSection
