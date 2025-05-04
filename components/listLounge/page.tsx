'use client'

import React from 'react'
import home from "@/app/[locale]/style/home.module.css"
import {useTranslations} from 'next-intl';

const ListLounge = () => {
  const t =  useTranslations("home");

  return (
    <>
      <div className={home.section_2}> 
        <div className={home.section_2_content}>
          <h1>{t('unique')}</h1>
          <p>{t('uniqueDesc')}</p>
        </div>
      </div>
      {/* {loungesFe.map((lounge, index) => (
         index % 2 === 0 ? (
            <div
            className={home.branch_section}
            key={lounge._id}
            style={{
              background: `url(${lounge.imageSlide?.[0]?.image}), linear-gradient(179.66deg, rgba(26, 26, 26, 0) 0.29%,rgba(26, 26, 26, 0.29) 63.24%)`
            }}
            >
            <div className={home.branch_layout}>
              <button className={home.branch_heading}>{lounge.name}</button>
              <div className={home.branch_detail_layout}>
                <p className={home.address_content}>{lounge.address}</p>
                <div className={home.branch_time}>
                  <span>{lounge.day}</span>
                  <p>{lounge.time}</p>
                </div>
              </div> 
              <div className={home.branch_phone}>
                <p>{lounge.phone}</p>
              </div>
            </div>
            <div className={home.branch_layout}>
              <div className={home.branch_button}>
                <Link href={`/our-lounges/${lounge.slug}`}><button>{t('explore')}</button></Link>
                <Link href={`/our-lounges/${lounge.slug}#menu`}><button>Menu</button></Link>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${home.branch_section} ${home.branch_section_2}`}
            key={lounge._id}
            style={{
              background: `url(${lounge.imageSlide?.[0]?.image}), linear-gradient(179.66deg, rgba(26, 26, 26, 0) 0.29%,rgba(26, 26, 26, 0.29) 63.24%)`
            }}
          >
            <div className={home.branch_layout}>
              <div className={home.branch_button}>
                <Link href={`/our-lounges/${lounge.slug}`}><button>{t('explore')}</button></Link>
                <Link href={`/our-lounges/${lounge.slug}#menu`}><button>Menu</button></Link>
              </div>
            </div>
            <div className={`${home.branch_layout} ${home.branch_layout_right}`}>
              <button className={home.branch_heading}>{lounge.name}</button>
              <div className={home.branch_detail_layout_2}>
                <div className={home.branch_time}>
                  <span>{lounge.day}</span>
                  <p>{lounge.time}</p>
                </div>
                <p className={home.address_content}>{lounge.address}</p>
              </div>
              <div className={home.branch_phone}>
                <p>{lounge.phone}</p>
              </div>
            </div>
          </div>
        )
      ))} */}
    </>
  )
}

export default ListLounge
