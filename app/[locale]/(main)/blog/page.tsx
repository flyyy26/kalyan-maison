'use client'

import React from 'react'
import blog from '@/app/[locale]/style/blog.module.css'
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import ContactSection from "@/components/Contact_section/page"
import { useTranslations } from 'next-intl'
import { useBlog } from '@/hooks/useBlog'; 

export default function Blog(){
    const t =  useTranslations();
    // const blogs = await fetchBlogs();
    const {
        blogs
      } = useBlog(); 

  return (
    <>
        <div className={blog.heading_blog}>
            <span>{t('blog.smallHeading')}</span>
            <h1>{t('blog.heading')}</h1>
        </div>
        <div className={blog.list_blog}>
            {blogs.map((blog_item) => (
                <div className={blog.list_box_blog} key={blog_item._id}>
                    <div className={blog.list_img_blog}>
                        <Image src={blog_item.image} fill alt={blog_item.title} objectFit='cover'/>
                    </div>
                    <div className={blog.list_content_blog}>
                        <div className={blog.list_heading_blog}>
                            <h3>{blog_item.title}</h3>
                            <span>{blog_item.date}</span>
                        </div>
                        <div className={blog.list_btn_blog}>
                            <Link href={`/blog/${blog_item.slug}`}><button>{t('blog.view')}</button></Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <ContactSection/>
    </>
  )
}