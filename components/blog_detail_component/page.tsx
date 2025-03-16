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
  const locale = params.locale || 'id'; // Ambil locale dari URL atau default ke 'id'

  const currentBlog = blogs.find((blog) => blog.slug === slug);
  const filteredBlogData = blogs.filter((blog_item) => blog_item.slug !== slug);

  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      .replace(/(\d+) (\w+) (\d+)/, '$1 $2, $3'); // Menambahkan koma setelah bulan
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

  // Panggil fungsi untuk menginkrementasi visitCount setelah komponen dimount
  useEffect(() => {
    if (currentBlog) {
      incrementVisitCount(currentBlog._id);
    }
  }, [currentBlog?._id, currentBlog]);

  if (!currentBlog) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={style.banner_blog}>
        <Image
          src={currentBlog.image instanceof File ? URL.createObjectURL(currentBlog.image) : currentBlog.image}
          fill
          style={{ objectFit: 'cover' }}
          alt={locale === 'en' ? currentBlog.titleEn : currentBlog.title}
        />
      </div>
      <div className={style.blog_content}>
        <div className={style.blog_heading}>
          <h1>{locale === 'en' ? currentBlog.titleEn : currentBlog.title}</h1>
          <span>{formatDate(currentBlog.date)}</span>
        </div>
        <div className={style.blog_desc}>
          <p
            dangerouslySetInnerHTML={{
              __html: locale === 'en' ? currentBlog.descriptionEn : currentBlog.description,
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
                  src={blog_item.image instanceof File ? URL.createObjectURL(blog_item.image) : blog_item.image}
                  fill
                  style={{ objectFit: 'cover' }}
                  alt={locale === 'en' ? blog_item.titleEn : blog_item.title}
                />
              </div>
              <div className={style.list_content_blog}>
                <div className={style.list_heading_blog}>
                  <h3>{locale === 'en' ? blog_item.titleEn : blog_item.title}</h3>
                  <span>{formatDate(blog_item.date)}</span>
                </div>
                <div className={style.list_btn_blog}>
                  <Link href={`/blog/${blog_item.slug}`}>
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