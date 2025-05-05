'use client';

import style from '@/app/[locale]/style/detail_blog.module.css';
import Image from 'next/image';
import ContactSection from '@/components/Contact_section/page';
import { Link } from '@/i18n/routing';
import { useBlog } from '@/hooks/useBlog';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function BlogDetailContent({
  slug,
  translations,
}: {
  slug: string;
  translations: { other: string; view: string };
}) {
  const { blogs } = useBlog();
  const params = useParams();
  const locale = (params.locale as string) || 'en'; // default ke 'en' jika tidak ada

  const getLocalizedSlug = (
    blog: { slugEn: string; slugCn: string; slugRs: string },
    locale: string | string[]
  ) => {
    switch (locale) {
      case 'en':
        return blog.slugEn;
      case 'cn':
        return blog.slugCn;
      case 'rs':
        return blog.slugRs;
      default:
        return blog.slugEn; // fallback ke en
    }
  };
  

  const currentBlog = blogs.find((blog) => getLocalizedSlug(blog, locale) === slug);
  const filteredBlogData = blogs.filter((blog) => getLocalizedSlug(blog, locale) !== slug);


  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      .replace(/(\d+) (\w+) (\d+)/, '$1 $2, $3');
  };

  const incrementVisitCount = async (id: string) => {
    try {
      await fetch(`/api/blog/${id}/visit`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Failed to increment visit count:', error);
    }
  };

  useEffect(() => {
    if (currentBlog) {
      incrementVisitCount(currentBlog._id);
    }
  }, [currentBlog?._id, currentBlog]);

  if (!currentBlog) {
    return <div>Loading...</div>;
  }

  // Utility untuk ambil konten sesuai locale
  const getLocalizedValue = (
    baseKey: string,
    obj: Record<string, unknown>,
    fallback = ''
  ) => {
    const key = `${baseKey}${locale.charAt(0).toUpperCase()}${locale.slice(1)}`;
    const value = obj[key];
    return typeof value === 'string' ? value : fallback;
  };
  

  return (
    <>
      <div className={style.banner_blog}>
        <Image
          src={
            currentBlog.image instanceof File
              ? URL.createObjectURL(currentBlog.image)
              : currentBlog.image
          }
          fill
          style={{ objectFit: 'cover' }}
          alt={getLocalizedValue('title', currentBlog)}
        />
      </div>
      <div className={style.blog_content}>
        <div className={style.blog_heading}>
          <h1>{getLocalizedValue('title', currentBlog)}</h1>
          <span>{formatDate(currentBlog.date)}</span>
        </div>
        <div className={style.blog_desc}>
          <div
            dangerouslySetInnerHTML={{
              __html: getLocalizedValue('description', currentBlog),
            }}
          />
        </div>
      </div>
      <div className={style.other_post}>
        <div className={style.other_post_heading}>
          <h1>{translations.other}</h1>
        </div>
        <div className={style.list_blog_layout}>
          {filteredBlogData.map((blog_item) => (
            <div className={style.list_box_blog} key={blog_item._id}>
              <div className={style.list_img_blog}>
                <Image
                  src={
                    blog_item.image instanceof File
                      ? URL.createObjectURL(blog_item.image)
                      : blog_item.image
                  }
                  fill
                  style={{ objectFit: 'cover' }}
                  alt={getLocalizedValue('title', blog_item)}
                />
              </div>
              <div className={style.list_content_blog}>
                <div className={style.list_heading_blog}>
                  <h3>{getLocalizedValue('title', blog_item)}</h3>
                  <span>{formatDate(blog_item.date)}</span>
                </div>
                <div className={style.list_btn_blog}>
                  <Link href={`/press/${blog_item.slugEn}`}>
                    <button>{translations.view}</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ContactSection />
    </>
  );
}
