'use client'

import React from 'react'
import style from '@/app/[locale]/style/reservation.module.css'
import { useState } from 'react';
import { HiChevronDown } from "react-icons/hi2";
import ContactSection from "@/components/Contact_section/page"
import { useTranslations } from 'next-intl';

const Reservation = () => { 
    const t =  useTranslations();
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

    const toggleDropdown = (id: string) => {
        setOpenDropdowns((prev) => ({
        ...prev,
        [id]: !prev[id], // Toggle visibility for the specific dropdown
        }));
    };

  return (
    <>
         <div className={style.reservation_layout}>
            <div className={style.reservation_content}>
                <h1>{t('reservation.heading')}</h1>
                <p>Terms n Conditions, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend mi vitae metus rutrum feugiat. Nam ultricies quis libero at laoreet. Aliquam interdum molestie purus, eget auctor eros faucibus non. Nam eget risus a nisl tempus interdum vel et nulla. Etiam vehicula magna non cursus faucibus. Mauris ullamcorper tristique ante, ut facilisis est luctus vel. Integer nibh libero, dignissim nec magna ac, mattis vehicula diam. Proin a dolor vel nulla eleifend dignissim.</p>
            </div>
            <div className={style.reservation_form}>
                <form action="">
                    <div className={style.form_double}>
                        <div className={`${style.dropdown} ${openDropdowns['dropdown1'] ? style.dropdown_active : ''}`}>
                            <button type='button' onClick={() => toggleDropdown('dropdown1')}>
                                Lounge* <HiChevronDown />
                            </button>
                            <div className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${openDropdowns['dropdown1'] ? style.dropdown_menu_show : ''}`}>
                                <button type='button'>Gunawarman</button>
                                <button type='button'>Kemang</button>
                                <button type='button'>Sudirman</button>
                            </div>
                        </div>
                        <div className={`${style.dropdown} ${openDropdowns['dropdown2'] ? style.dropdown_active : ''}`}>
                            <button type='button' onClick={() => toggleDropdown('dropdown2')}>
                                Spaces* <HiChevronDown />
                            </button>
                            <div className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${openDropdowns['dropdown2'] ? style.dropdown_menu_show : ''}`}>
                                <button type='button'>Gunawarman</button>
                                <button type='button'>Kemang</button>
                                <button type='button'>Sudirman</button>
                            </div>
                        </div>
                    </div>
                    <div className={style.form_single}>
                        <input type="text" placeholder='Name*'/>
                    </div>
                    <div className={style.form_single}>
                        <input type="text" placeholder='Phone Number*'/>
                    </div>
                    <div className={style.form_double}>
                        <div className={`${style.dropdown} ${openDropdowns['dropdown3'] ? style.dropdown_active : ''}`}>
                            <button type='button' onClick={() => toggleDropdown('dropdown3')}>
                                Date* <HiChevronDown />
                            </button>
                            <div className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${openDropdowns['dropdown3'] ? style.dropdown_menu_show : ''}`}>
                                <button type='button'>Gunawarman</button>
                                <button type='button'>Kemang</button>
                                <button type='button'>Sudirman</button>
                            </div>
                        </div>
                        <div className={`${style.dropdown} ${openDropdowns['dropdown4'] ? style.dropdown_active : ''}`}>
                            <button type='button' onClick={() => toggleDropdown('dropdown4')}>
                                Time* <HiChevronDown />
                            </button>
                            <div className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${openDropdowns['dropdown4'] ? style.dropdown_menu_show : ''}`}>
                                <button type='button'>Gunawarman</button>
                                <button type='button'>Kemang</button>
                                <button type='button'>Sudirman</button>
                            </div>
                        </div>
                    </div>
                    <div className={style.form_double}>
                        <div className={`${style.dropdown} ${openDropdowns['dropdown5'] ? style.dropdown_active : ''}`}>
                            <button type='button' onClick={() => toggleDropdown('dropdown5')}>
                                Duration* <HiChevronDown />
                            </button>
                            <div className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${openDropdowns['dropdown5'] ? style.dropdown_menu_show : ''}`}>
                                <button type='button'>Gunawarman</button>
                                <button type='button'>Kemang</button>
                                <button type='button'>Sudirman</button>
                            </div>
                        </div>
                        <div className={`${style.dropdown} ${openDropdowns['dropdown6'] ? style.dropdown_active : ''}`}>
                            <button type='button' onClick={() => toggleDropdown('dropdown6')}>
                                Number Of Persons* <HiChevronDown />
                            </button>
                            <div className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${openDropdowns['dropdown6'] ? style.dropdown_menu_show : ''}`}>
                                <button type='button'>Gunawarman</button>
                                <button type='button'>Kemang</button>
                                <button type='button'>Sudirman</button>
                            </div>
                        </div>
                    </div>
                    <button className={style.btn_primary}>{t('reservation.button')}</button>
                </form>
            </div>
         </div>
         <ContactSection/>
    </>
  )
}

export default Reservation
