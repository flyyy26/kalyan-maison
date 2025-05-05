'use client'
import React from 'react'
import Link from 'next/link';
import home from "@/app/[locale]/style/home.module.css"
import {useTranslations} from 'next-intl';
import {useContact} from '@/hooks/useContact'
import { IoLogoYoutube } from "react-icons/io";
import { FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
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
              {ContactDetail.instagram !== 'undefined' && (
                  <Link href={ContactDetail.instagram} target="_blank">
                    <button className={home.banner_social_media_box}>
                      <FaInstagram />
                    </button>
                  </Link>
                )}
    
                {ContactDetail.youtube !== 'undefined' && (
                  <Link href={ContactDetail.youtube} target="_blank">
                    <button className={home.banner_social_media_box}>
                      <IoLogoYoutube />
                    </button>
                  </Link>
                )}
    
                {ContactDetail.tiktok !== 'undefined' && (
                  <Link href={ContactDetail.tiktok} target="_blank">
                    <button className={home.banner_social_media_box}>
                      <FaTiktok />
                    </button>
                  </Link>
                )}
    
                {ContactDetail.email !== 'undefined' && (
                  <Link href={`mailto:${ContactDetail.email}`} target="_blank">
                    <button className={home.banner_social_media_box}>
                      <MdEmail />
                    </button>
                  </Link>
                )}
    
                {ContactDetail.facebook !== 'undefined' && (
                  <Link href={ContactDetail.facebook} target="_blank">
                    <button className={home.banner_social_media_box}>
                      <FaFacebook />
                    </button>
                  </Link>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactSection
