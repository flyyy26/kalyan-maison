"use client"

import React from 'react'
import menu from "@/app/[locale]/style/menu.module.css"
// import Link from 'next/link';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import Logo from "@/public/images/logo.png"
import {useMenu} from "@/context/MenuContext"
import {useTranslations} from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useBlog } from '@/hooks/useBlog';
// import { useState } from 'react';

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
    const { blogs } = useBlog();

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
    // const [openSelect, setOpenSelect] = useState(false);
    
    //   const toggleDropdown = () => {
    //     setOpenSelect(!openSelect); // Toggle dropdown visibility
    //   };

    const changeLanguage = (lang: string) => {
        let newPath = `/${lang}${pathAfterLocale}`;
    
        // Cek apakah kita di halaman press detail
        const parts = pathAfterLocale.split('/').filter(Boolean); // misalnya ['press', 'testing-cn']
        if (parts[0] === 'press' && parts[1]) {
          const currentSlug = parts[1];
          const matchedBlog = blogs.find(
            (b) => b.slugEn === currentSlug || b.slugCn === currentSlug || b.slugRs === currentSlug
          );
    
          if (matchedBlog) {
            const newSlug = getLocalizedSlug(matchedBlog, lang);
            newPath = `/${lang}/press/${newSlug}`;
          }
        }
    
        // Tambahkan query params kalau ada
        const fullUrl = newPath + (searchParams.toString() ? `?${searchParams}` : '');
        router.push(fullUrl);
      };
    

    return ( 
        <>
        {/* <div className={`${menu.navbar_container} ${isOpen ? menu.navbarContainer_active : ''}`}> */}
            <div className={`${menu.navbar} ${isOpen ? menu.navbarBorder : ''}`}>
                <div className={menu.navbar_layout}>
                    <Link href="/">
                        <div className={menu.logo} onClick={() => toggleMenu(true)}>
                            <Image width={800} height={800} src={Logo} alt='Kalyan Maison Logo' style={{height: 'auto', objectFit:'cover'}}/>
                        </div>
                    </Link>
                    {/* <button
                        className={`${menu.hamburger} ${isOpen ? menu.iconOpen : ''}`}
                        aria-label="Toggle Menu"
                        onClick={() => toggleMenu(false)}
                    >
                        <span className={`${menu.icon} ${isOpen ? menu.hidden : menu.visible}`}>
                            <AiOutlineMenu />
                        </span>
                        <span className={`${menu.icon} ${isOpen ? menu.visible : menu.hidden}`}>
                            <AiOutlineClose />
                        </span>
                    </button> */}
                </div>
                <div className={menu.menu_layout}>
                    <ul>
                        <Link href="/"><li>{t('home')}</li></Link>
                        <Link onClick={() => toggleMenu(true)} href="/about"><li>{t('aboutUs')}</li></Link>
                        <Link href="/"><li>{t('gallery')}</li></Link>
                        <Link href="/"><li>{t('contact')}</li></Link>
                        <Link href="/press"><li>{t('press')}</li></Link>
                    </ul>
                </div>
                <div className={menu.navbar_layout}>
                    {/* {currentLocale === 'en' ? (
                        <span onClick={() => changeLanguage('id')} style={{ cursor: 'pointer' }}>
                        ID
                        </span>
                    ) : (
                        <span onClick={() => changeLanguage('en')} style={{ cursor: 'pointer' }}>
                        EN
                        </span>
                    )} */}
                    <span className={currentLocale === 'en' ? menu.active_lang : ''} onClick={() => changeLanguage('en')}>EN</span>/
                    <span className={currentLocale === 'cn' ? menu.active_lang : ''} onClick={() => changeLanguage('cn')}>CN</span>/
                    <span className={currentLocale === 'rs' ? menu.active_lang : ''} onClick={() => changeLanguage('rs')}>RS</span>

                    {/* <Link href="/reservation"><button className={menu.btn_primary}>{t('reserve')}</button></Link> */}
                </div>
            </div>
            <nav className={`${menu.menu} ${isOpen ? menu.menuOpen : ''}`}>
                <ul>
                    <li><Link onClick={() => toggleMenu(true)} href="/our-lounges">{t('allLounges')}</Link></li>
                    <li><Link onClick={() => toggleMenu(true)} href="/about">{t('aboutUs')}</Link></li>
                    <li><Link onClick={() => toggleMenu(true)} href="/blog">{t('blog')}</Link></li>
                </ul>
            </nav>
        {/* </div> */}
        </>
    )
}

export default Navbar;
