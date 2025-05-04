'use client'

import React from 'react'
import blog from '@/app/[locale]/style/blog.module.css'
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import ContactSection from "@/components/Contact_section/page"
import { useTranslations } from 'next-intl'
import { useBlog } from '@/hooks/useBlog'; 
import { useParams } from 'next/navigation';
import LoadingPopup from '@/components/loading_popup/page';

export default function Blog(){
    const t =  useTranslations();
    // const blogs = await fetchBlogs();
    const {
        blogs
      } = useBlog(); 

    const params = useParams();
    const locale = params.locale || 'id'; 

    const formatDate = (dateString: string) => {
    return new Date(dateString)
        .toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        })
        .replace(/(\d+) (\w+) (\d+)/, '$1 $2, $3'); // Menambahkan koma setelah bulan
    }; 
 
  return (
    <>
    <LoadingPopup duration={700} />
        <div className={blog.heading_blog}>
            <h1>{t('blog.heading')}</h1>
        </div>
        <div className={blog.list_blog}>
            {blogs.length > 0 ? (
            blogs.map((blog_item) => (
                <div className={blog.list_box_blog} key={blog_item._id}>
                    <div className={blog.list_img_blog}>
                        <Image src={blog_item.image instanceof File ? URL.createObjectURL(blog_item.image) : blog_item.image} fill alt={blog_item.title} objectFit='cover'/>
                    </div>
                    <div className={blog.list_content_blog}>
                        <div className={blog.list_heading_blog}>
                            <span>{formatDate(blog_item.date)}</span>
                            <h3>{blog_item.title}</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia alias dicta libero facere ullam numquam culpa.</p>
                        </div>
                        <div className={blog.list_btn_blog}>
                        <Link href={`/blog/${blog_item.slug}`}><button>{t('blog.view')}</button></Link>
                        </div>
                    </div>
                </div>
            ))
            ) : (
            <p>Blog Kosong</p>
            )}
        </div>
        <ContactSection/>
    </>
  )
}