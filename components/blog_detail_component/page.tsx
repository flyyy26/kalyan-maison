'use client';

import style from '@/app/[locale]/style/detail_blog.module.css';
import Image from 'next/image';
import ContactSection from '@/components/Contact_section/page';
import { Link } from '@/i18n/routing';
import { useBlog } from '@/hooks/useBlog';

export default function BlogDetailContent({
  slug,
  translations,
}: {
  slug: string;
  translations: { other: string; view: string };
}) {
  const { blogs } = useBlog();

  if (!blogs.length) {
    return <div>Loading...</div>;
  }

  const currentBlog = blogs.find((blog) => blog.slug === slug);
  const filteredBlogData = blogs.filter((blog_item) => blog_item.slug !== slug);

  return (
    <>
      {currentBlog ? (
        <>
          <div className={style.banner_blog}>
            <Image
              src={currentBlog.image}
              fill
              style={{ objectFit: 'cover' }}
              alt={currentBlog.title}
            />
          </div>
          <div className={style.blog_content}>
            <div className={style.blog_heading}>
              <h1>{currentBlog.title}</h1>
              <span>{currentBlog.date}</span>
            </div>
            <div className={style.blog_desc}>
              <p dangerouslySetInnerHTML={{ __html: currentBlog.description }} />
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
                      src={blog_item.image}
                      fill
                      style={{ objectFit: 'cover' }}
                      alt={blog_item.description}
                    />
                  </div>
                  <div className={style.list_content_blog}>
                    <div className={style.list_heading_blog}>
                      <h3>{blog_item.title}</h3>
                      <span>{blog_item.date}</span>
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
      ) : (
        <h1>Blog not found</h1>
      )}
    </>
  );
}
