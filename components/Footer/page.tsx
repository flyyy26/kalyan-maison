import React from 'react'
import footer from '@/app/[locale]/style/footer.module.css'
import Image from 'next/image'
import Logo from '@/public/images/logo_footer.png'
import { useTranslations } from 'next-intl'

const Footer = () => {
  const t =  useTranslations("footer");
  return ( 
    <>
      <div className={footer.footer_container}>
        <div className={footer.footer_logo}>
            <Image src={Logo} width={800} height={800} alt='Logo Kalya Maison' style={{height: 'auto', objectFit: 'cover'}} />
        </div>
        <div className={footer.copyright}>
            <span>{t('copyright')}</span>
        </div>
      </div>
    </>
  )
}

export default Footer 