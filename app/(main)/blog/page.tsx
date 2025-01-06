import React from 'react'
import blog from '@/app/style/blog.module.css'
import Image from 'next/image';
import Link from 'next/link';
import ContactSection from "@/components/Contact_section/page"

interface Blog {
    id: number;
    slug:string;
    heading: string;
    cover: string;
    date: string;
}

async function fetchBlogs(): Promise<Blog[]> {
    // Simulasi fetch data
    return [
        { id: 1, slug:'e1-musthave-overview', heading: 'E1:MUSTHAVE OVERVIEW', cover: '/images/gunawarman_cover.png', date: '21 January, 2022'},
        { id: 2, slug:'e2-musthave-overview', heading: 'E2:MUSTHAVE OVERVIEW', cover: '/images/sudirman_cover.png', date: '21 January, 2022'},
        { id: 3, slug:'e3-musthave-overview', heading: 'E3:MUSTHAVE OVERVIEW', cover: '/images/kemang_cover.png',  date: '21 January, 2022'},
    ];
  }

export default async function Blog(){
    const blogs = await fetchBlogs();

  return (
    <>
        <div className={blog.heading_blog}>
            <span>Our</span>
            <h1>Blog</h1>
        </div>
        <div className={blog.list_blog}>
            {blogs.map((blog_item) => (
                <div className={blog.list_box_blog} key={blog_item.id}>
                    <div className={blog.list_img_blog}>
                        <Image src={blog_item.cover} fill alt={blog_item.heading} objectFit='cover'/>
                    </div>
                    <div className={blog.list_content_blog}>
                        <div className={blog.list_heading_blog}>
                            <h3>{blog_item.heading}</h3>
                            <span>{blog_item.date}</span>
                        </div>
                        <div className={blog.list_btn_blog}>
                            <Link href={`/blog/${blog_item.slug}`}><button>View Post</button></Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <ContactSection/>
    </>
  )
}