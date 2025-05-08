"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import menu from "@/app/[locale]/style/menu.module.css"
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import Logo from "@/public/images/logo.png"
import {useMenu} from "@/context/MenuContext"
import {useTranslations} from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useBlog } from '@/hooks/useBlog';
import { VscMenu } from "react-icons/vsc";
import {useContact} from '@/hooks/useContact'
import { useLocationContext } from '@/context/LocationContext'; 
import { FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { useCity } from '@/hooks/useCity';

type Blog = {
    slugEn: string;
    slugCn: string;
    slugRs: string;
  };
  

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { loungesFe } = useLocationContext();
    const searchParams = useSearchParams();
    const currentLocale = pathname.split('/')[1];
    const pathAfterLocale = pathname.replace(`/${currentLocale}`, '');
    const { isOpen, toggleMenu } = useMenu();
    const t =  useTranslations("navbar");
    const { pressDetail } = useBlog();
    const { ContactDetail } = useContact();

    const { cities } = useCity();
      
      const [selectedCity, setSelectedCity] = useState<string | null>(null);
      const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
      // const [openSelect, setOpenSelect] = useState(false);
  
      useEffect(() => {
          if (cities.length > 0 && !selectedCity) {
              setSelectedCity(cities[0].name); 
              setSelectedCityId(cities[0]._id); // Simpan ID kota yang dipilih
          }
      }, [cities, selectedCity]);

      const filteredLounges = loungesFe.filter((location) => location.city === selectedCityId);
            
      useEffect(() => {
          if (cities.length > 0) {
              // Cari kota pertama yang memiliki lounge
              const cityWithLounge = cities.find(city => 
                  loungesFe.some(lounge => lounge.city === city._id)
              );
      
              if (cityWithLounge) {
                  setSelectedCity(cityWithLounge.name);
                  setSelectedCityId(cityWithLounge._id);
              } else {
                  // Jika tidak ada kota dengan lounge, pilih kota pertama secara default
                  setSelectedCity(cities[0].name);
                  setSelectedCityId(cities[0]._id);
              }
          }
      }, [cities, loungesFe]);

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
                            <Image width={800} height={800} src={Logo} alt='Kalyan Maison Logo' style={{height: 'auto'}}/>
                        </div>
                    </Link>
                </div>
                <div className={`${menu.menu_layout}`}>
                    <ul>
                        <Link href="/"><li>{t('home')}</li></Link>
                        <Link onClick={() => toggleMenu(true)} href="/about"><li>{t('aboutUs')}</li></Link>
                        <Link
                            href={`#gallery`}
                            onClick={(e) => {
                                e.preventDefault();
                                const section = document.getElementById('gallery');
                                if (section) {
                                section.scrollIntoView({ behavior: 'smooth' });
                                toggleMenu(true);
                                } else {
                                router.push(`/${currentLocale}#gallery`);
                                }
                            }}
                        ><li>{t('gallery')}</li></Link>
                        <Link href="/contact"><li>{t('contact')}</li></Link>
                        <Link href="/press"><li>{t('press')}</li></Link>
                    </ul>
                </div>
                <div className={`${menu.navbar_layout} ${menu.navbar_layout_mobile}`}>
                    <span className={currentLocale === 'en' ? menu.active_lang : ''} onClick={() => changeLanguage('en')}>EN</span>/
                    <span className={currentLocale === 'cn' ? menu.active_lang : ''} onClick={() => changeLanguage('cn')}>CN</span>/
                    <span className={currentLocale === 'rs' ? menu.active_lang : ''} onClick={() => changeLanguage('rs')}>RS</span>
                </div>
                <button className={menu.hamburger} onClick={() => toggleMenu(false)}><VscMenu/></button>
            </div>
            <nav className={`${menu.menu} ${isOpen ? menu.menuOpen : ''}`}>
                <ul>
                    <li><Link onClick={() => toggleMenu(true)} href="/">{t('home')}</Link></li>
                    <Link onClick={() => toggleMenu(true)} href="/about"><li>{t('aboutUs')}</li></Link>
                    <Link
                        href={`#gallery`}
                        onClick={(e) => {
                            e.preventDefault();
                            const section = document.getElementById('gallery');
                            if (section) {
                            section.scrollIntoView({ behavior: 'smooth' });
                            toggleMenu(true);
                            } else {
                            router.push(`/${currentLocale}#gallery`);
                            }
                        }}
                    ><li>{t('gallery')}</li></Link>
                    <Link onClick={() => toggleMenu(true)} href="/contact"><li>{t('contact')}</li></Link>
                    <Link onClick={() => toggleMenu(true)} href="/press"><li>{t('press')}</li></Link>
                </ul>
                <div className={`${menu.banner_bottom_content}`}>
                  <div className={`${menu.navbar_layout} ${menu.navbar_layout_menu}`}>
                      <span className={currentLocale === 'en' ? menu.active_lang : ''} onClick={() => changeLanguage('en')}>EN</span>/
                      <span className={currentLocale === 'cn' ? menu.active_lang : ''} onClick={() => changeLanguage('cn')}>CN</span>/
                      <span className={currentLocale === 'rs' ? menu.active_lang : ''} onClick={() => changeLanguage('rs')}>RS</span>
                  </div>
                  <div className={menu.banner_branch}>
                    <div className={`${menu.branch_list}`}>
                        {filteredLounges.map((lounge) => (
                        <Link
                          key={lounge._id}
                          href="/"
                        >
                          {lounge.name}
                        </Link>
                        ))}
                    </div>
                  </div>
                  <div className={menu.banner_social_media}>
                    {ContactDetail.instagram !== 'undefined' && (
                      <Link href={ContactDetail.instagram} target="_blank">
                        <button className={menu.banner_social_media_box}>
                          <FaInstagram />
                        </button>
                      </Link>
                    )}
        
                    {ContactDetail.youtube !== 'undefined' && (
                      <Link href={ContactDetail.youtube} target="_blank">
                        <button className={menu.banner_social_media_box}>
                          <IoLogoYoutube />
                        </button>
                      </Link>
                    )}
        
                    {ContactDetail.tiktok !== 'undefined' && (
                      <Link href={ContactDetail.tiktok} target="_blank">
                        <button className={menu.banner_social_media_box}>
                          <FaTiktok />
                        </button>
                      </Link>
                    )}
        
                    {ContactDetail.email !== 'undefined' && (
                      <Link href={`mailto:${ContactDetail.email}`} target="_blank">
                        <button className={menu.banner_social_media_box}>
                          <MdEmail />
                        </button>
                      </Link>
                    )}
        
                    {ContactDetail.facebook !== 'undefined' && (
                      <Link href={ContactDetail.facebook} target="_blank">
                        <button className={menu.banner_social_media_box}>
                          <FaFacebook />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;
