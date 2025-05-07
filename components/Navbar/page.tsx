"use client"

import React from 'react'
import menu from "@/app/[locale]/style/menu.module.css"
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import Logo from "@/public/images/logo.png"
import {useMenu} from "@/context/MenuContext"
import {useTranslations} from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useBlog } from '@/hooks/useBlog';

type Blog = {
    slugEn: string;
    slugCn: string;
    slugRs: string;
  };
  

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentLocale = pathname.split('/')[1];
    const pathAfterLocale = pathname.replace(`/${currentLocale}`, '');
    const { isOpen, toggleMenu } = useMenu();
    const t =  useTranslations("navbar");
    const { pressDetail } = useBlog();

    const getLocalizedSlug = (blog: Blog, locale: string): string => {
      switch (locale) {
        case 'en':
          return blog.slugEn;
        case 'cn':
          return blog.slugCn;
        case 'rs':
          return blog.slugRs;
        default:
          return blog.slugEn;
      }
    };

    const changeLanguage = (lang: string) => {
      let newPath = `/${lang}${pathAfterLocale}`;
      const parts = pathAfterLocale.split('/').filter(Boolean); // misalnya ['press', 'testing-cn']

      // Check if we are on the press detail page
      if (parts[0] === 'press' && parts[1] && pressDetail) {
        // Get the localized slug for the selected language
        const newSlug = getLocalizedSlug(pressDetail, lang);
        newPath = `/${lang}/press/${newSlug}`;
      } else {
        newPath = `/${lang}${pathAfterLocale}`;
      }

      // Add query params if there are any
      const fullUrl = newPath + (searchParams.toString() ? `?${searchParams}` : '');
      router.push(fullUrl);
    };    
    

    return ( 
        <>
            <div className={`${menu.navbar} ${isOpen ? menu.navbarBorder : ''}`}>
                <div className={menu.navbar_layout}>
                    <Link href="/">
                        <div className={menu.logo} onClick={() => toggleMenu(true)}>
                            <Image width={800} height={800} src={Logo} alt='Kalyan Maison Logo' style={{height: 'auto', objectFit:'cover'}}/>
                        </div>
                    </Link>
                </div>
                <div className={menu.menu_layout}>
                    <ul>
                        <Link href="/"><li>{t('home')}</li></Link>
                        <Link onClick={() => toggleMenu(true)} href="/about"><li>{t('aboutUs')}</li></Link>
                        <Link
                            href={`#gallery`}
                            onClick={(e) => {
                                e.preventDefault(); // agar tidak reload
                                const section = document.getElementById('gallery');
                                if (section) {
                                section.scrollIntoView({ behavior: 'smooth' });
                                toggleMenu(true); // menutup menu jika perlu
                                } else {
                                // fallback kalau sedang di halaman lain
                                router.push(`/${currentLocale}#gallery`);
                                }
                            }}
                        ><li>{t('gallery')}</li></Link>
                        <Link href="/contact"><li>{t('contact')}</li></Link>
                        <Link href="/press"><li>{t('press')}</li></Link>
                    </ul>
                </div>
                <div className={menu.navbar_layout}>
                    <span className={currentLocale === 'en' ? menu.active_lang : ''} onClick={() => changeLanguage('en')}>EN</span>/
                    <span className={currentLocale === 'cn' ? menu.active_lang : ''} onClick={() => changeLanguage('cn')}>CN</span>/
                    <span className={currentLocale === 'rs' ? menu.active_lang : ''} onClick={() => changeLanguage('rs')}>RS</span>
                </div>
            </div>
            <nav className={`${menu.menu} ${isOpen ? menu.menuOpen : ''}`}>
                <ul>
                    <li><Link onClick={() => toggleMenu(true)} href="/our-lounges">{t('allLounges')}</Link></li>
                    <li><Link onClick={() => toggleMenu(true)} href="/about">{t('aboutUs')}</Link></li>
                    <li><Link onClick={() => toggleMenu(true)} href="/blog">{t('blog')}</Link></li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar;
