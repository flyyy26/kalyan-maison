'use client'

import React from 'react'
import about from '@/app/[locale]/style/about.module.css'
import ContactSection from "@/components/Contact_section/page"
import { useTranslations } from 'next-intl'
import LoadingPopup from '@/components/loading_popup/page';

const About = () => { 
  const t =  useTranslations();
  return (
    <>
    <LoadingPopup duration={700} />
       <div className={about.section_1}>
            <span>{t('about.smallHeading')}</span>
            <h1>Kalyan Maison</h1>
            <div className={about.about_content}>
            <p>{t('about.desc_one')}</p>
            <p>{t('about.desc_two')}</p>
            <p>{t('about.desc_three')}</p>
            <p>{t('about.desc_four')}</p>
            <p>{t('about.desc_five')}</p>
            </div>
       </div>
       <ContactSection/>
    </>
  )
}

export default About
