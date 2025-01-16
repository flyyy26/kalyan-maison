'use client'

import React from 'react'
import about from '@/app/[locale]/style/about.module.css'
import ContactSection from "@/components/Contact_section/page"
import { useTranslations } from 'next-intl'

const About = () => {
  const t =  useTranslations();
  return (
    <>
       <div className={about.section_1}>
            <span>{t('about.smallHeading')}</span>
            <h1>Kalyan Maison</h1>
            <div className={about.about_content}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend mi vitae metus rutrum feugiat. Nam ultricies quis libero at laoreet. Aliquam interdum molestie purus, eget auctor eros faucibus non. Nam eget risus a nisl tempus interdum vel et nulla. Etiam vehicula magna non cursus faucibus. Mauris ullamcorper tristique ante, ut facilisis est luctus vel. Integer nibh libero, dignissim nec magna ac, mattis vehicula diam. Proin a dolor vel nulla eleifend dignissim.</p>
                <p>Sed non augue dictum, tempor ligula ac, pharetra sapien. Duis gravida, libero eget accumsan congue, purus leo aliquet tortor, eu ultricies mauris quam nec lacus. Integer hendrerit, mauris ac fermentum vestibulum, ex lacus dignissim ligula, a porttitor mi libero sed metus. Etiam iaculis maximus justo non blandit. Donec ultrices nibh nec ipsum mattis, eu tempus lectus lacinia. Aliquam lorem diam, convallis id dapibus vitae, placerat sed enim. Donec rhoncus, tellus vel pharetra elementum, ligula neque ultricies enim, eget imperdiet odio augue at nibh. Morbi rhoncus eros eu facilisis commodo. Sed lorem turpis, auctor at justo vestibulum, vulputate ultrices lectus. Proin hendrerit luctus suscipit. Vestibulum lobortis nulla ut odio rhoncus, in aliquam sem rhoncus. Cras pulvinar sagittis finibus. Cras placerat magna leo. Nam consectetur fermentum ornare.</p>
            </div>
       </div>
       <ContactSection/>
    </>
  )
}

export default About
