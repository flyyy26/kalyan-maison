'use client'

import React from 'react'
import blog from '@/app/[locale]/style/blog.module.css'
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import ContactSection from "@/components/Contact_section/page"
import { useTranslations } from 'next-intl'
import { useBlog } from '@/hooks/useBlog'; 
// import { useParams } from 'next/navigation';
import LoadingPopup from '@/components/loading_popup/page';
import { useParams } from 'next/navigation';
import GallerySection from '@/components/GallerySection/page';

interface Blog {
  slugEn: string;
  slugCn: string;
  slugRs: string;
  // ... properti lainnya
}

export default function Blog(){
    const t =  useTranslations();
    // const blogs = await fetchBlogs();
    const {
        blogs
      } = useBlog(); 

    const params = useParams();
    const locale = params.locale || 'en';

    // const params = useParams();
    // const locale = params.locale || 'id'; 

    // const formatDate = (dateString: string) => {
    // return new Date(dateString)
    //     .toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-GB', {
    //     day: 'numeric',
    //     month: 'long',
    //     year: 'numeric',
    //     })
    //     .replace(/(\d+) (\w+) (\d+)/, '$1 $2, $3'); // Menambahkan koma setelah bulan
    // }; 
 
  return (
    <>
    <LoadingPopup duration={700} />
    <div className={blog.list_blog_container}>
        <div className={blog.heading_blog}>
            <h1>{t('blog.heading')}</h1>
        </div>
        
          <div className={blog.list_blog}>
              {blogs.length > 0 ? (
                  blogs.map((blog_item) => {
                  const titleMap = {
                      en: blog_item.titleEn,
                      cn: blog_item.titleCn,
                      rs: blog_item.titleRs,
                  };
                  const descMap = {
                      en: blog_item.descriptionEn,
                      cn: blog_item.descriptionCn,
                      rs: blog_item.descriptionRs,
                  };

                  function stripHtmlTags(html: string, tagNames: string[]): string {
                    const tagsPattern = tagNames.map(tag => `<${tag}[^>]*>|</${tag}>`).join('|');
                    const regex = new RegExp(tagsPattern, 'gi');
                    const stripped = html.replace(regex, '');
                    return stripped.slice(0, 100); // Batasi jadi 100 huruf
                  }                  

                  const supportedLocales = ['en', 'cn', 'rs'] as const;
                  type Locale = (typeof supportedLocales)[number];

                  const rawLocale = Array.isArray(locale) ? locale[0] : locale;
                  const safeLocale: Locale = supportedLocales.includes(rawLocale as Locale) ? (rawLocale as Locale) : 'en';

                  // const rawDesc = descMap[safeLocale];
                  // const cleanDesc = rawDesc.replace(/<\/?p>/g, '');

                  const rawDesc = descMap[safeLocale];
                  const cleanDesc = stripHtmlTags(rawDesc, ['p', 'strong']);

                  const getLocalizedSlug = (blog: Blog) => {
                      switch (locale) {
                        case 'en':
                          return blog.slugEn;
                        case 'cn':
                          return blog.slugCn;
                        case 'rs':
                          return blog.slugRs;
                        default:
                          return blog.slugEn; // fallback ke English
                      }
                    };

                  return (
                      <div className={blog.list_box_blog} key={blog_item._id}>
                      <div className={blog.list_img_blog}>
                          <Image
                          src={
                              blog_item.image instanceof File
                              ? URL.createObjectURL(blog_item.image)
                              : blog_item.image
                          }
                          fill
                          alt={titleMap[safeLocale]}
                          objectFit="cover"
                          />
                      </div>
                      <div className={blog.list_content_blog}>
                          <div className={blog.list_heading_blog}>
                          <span>{blog_item.source}</span>
                          <Link href={`/press/${getLocalizedSlug(blog_item)}`}>
                            <h3>{titleMap[safeLocale]}</h3>
                          </Link>
                          
                          </div>
                          <p>{cleanDesc}</p>
                          <div className={blog.list_btn_blog}>
                            <Link href={`/press/${blog_item.slugEn}`}>
                                <button>{t('blog.view')}</button>
                            </Link>
                          </div>
                      </div>
                      </div>
                  );
                  })
              ) : (
                  <p>Blog Kosong</p>
              )}
          </div>
        </div>

        <GallerySection/>
        <ContactSection/>
    </>
  )
}