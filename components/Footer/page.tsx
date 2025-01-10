import React from 'react'
import footer from '@/app/[locale]/style/footer.module.css'
import Image from 'next/image'
import Logo from '@/public/images/logo_footer.png'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const page = () => {
  const t =  useTranslations("footer");
  return (
    <>
      <div className={footer.footer_container}>
        <div className={footer.footer_logo}>
            <Image src={Logo} fill alt='Logo Kalya Maison' objectFit='contain' />
        </div>
        <div className={footer.menu}>
            <ul>
                <li><Link href="/">{t('privacy')}</Link></li>
                <li><Link href="/">{t('use')}</Link></li>
            </ul>
        </div>
        <div className={footer.copyright}>
            <span>{t('copyright')}</span>
        </div>
      </div>
    </>
  )
}

export default page