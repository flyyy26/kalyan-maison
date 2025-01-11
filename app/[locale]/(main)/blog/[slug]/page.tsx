import style from '@/app/[locale]/style/detail_blog.module.css';
import Image from 'next/image';
import ContactSection from '@/components/Contact_section/page';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export default async function BlogDetailPage({
  params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
  const t = await getTranslations('blog');
  const slug = (await params).slug; 

  // Data dummy
  const blogData = [
    { id: 1, slug: 'e1-musthave-overview', heading: 'E1:MUSTHAVE OVERVIEW', cover: '/images/gunawarman_cover.png', date: '21 January, 2022', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend mi vitae metus rutrum feugiat. Nam ultricies quis libero at laoreet. Aliquam interdum molestie purus, eget auctor eros faucibus non. Nam eget risus a nisl tempus interdum vel et nulla. Etiam vehicula magna non cursus faucibus. Mauris ullamcorper tristique ante, ut facilisis est luctus vel. Integer nibh libero, dignissim nec magna ac, mattis vehicula diam. Proin a dolor vel nulla eleifend dignissim. </br> </br> Sed non augue dictum, tempor ligula ac, pharetra sapien. Duis gravida, libero eget accumsan congue, purus leo aliquet tortor, eu ultricies mauris quam nec lacus. Integer hendrerit, mauris ac fermentum vestibulum, ex lacus dignissim ligula, a porttitor mi libero sed metus. Etiam iaculis maximus justo non blandit. Donec ultrices nibh nec ipsum mattis, eu tempus lectus lacinia. Aliquam lorem diam, convallis id dapibus vitae, placerat sed enim. Donec rhoncus, tellus vel pharetra elementum, ligula neque ultricies enim, eget imperdiet odio augue at nibh. Morbi rhoncus eros eu facilisis commodo. Sed lorem turpis, auctor at justo vestibulum, vulputate ultrices lectus. Proin hendrerit luctus suscipit. Vestibulum lobortis nulla ut odio rhoncus, in aliquam sem rhoncus. Cras pulvinar sagittis finibus. Cras placerat magna leo. Nam consectetur fermentum ornare.' },
    { id: 2, slug: 'e2-musthave-overview', heading: 'E2:MUSTHAVE OVERVIEW', cover: '/images/sudirman_cover.png', date: '21 January, 2022', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend mi vitae metus rutrum feugiat. Nam ultricies quis libero at laoreet. Aliquam interdum molestie purus, eget auctor eros faucibus non. Nam eget risus a nisl tempus interdum vel et nulla. Etiam vehicula magna non cursus faucibus. Mauris ullamcorper tristique ante, ut facilisis est luctus vel. Integer nibh libero, dignissim nec magna ac, mattis vehicula diam. Proin a dolor vel nulla eleifend dignissim. </br> </br> Sed non augue dictum, tempor ligula ac, pharetra sapien. Duis gravida, libero eget accumsan congue, purus leo aliquet tortor, eu ultricies mauris quam nec lacus. Integer hendrerit, mauris ac fermentum vestibulum, ex lacus dignissim ligula, a porttitor mi libero sed metus. Etiam iaculis maximus justo non blandit. Donec ultrices nibh nec ipsum mattis, eu tempus lectus lacinia. Aliquam lorem diam, convallis id dapibus vitae, placerat sed enim. Donec rhoncus, tellus vel pharetra elementum, ligula neque ultricies enim, eget imperdiet odio augue at nibh. Morbi rhoncus eros eu facilisis commodo. Sed lorem turpis, auctor at justo vestibulum, vulputate ultrices lectus. Proin hendrerit luctus suscipit. Vestibulum lobortis nulla ut odio rhoncus, in aliquam sem rhoncus. Cras pulvinar sagittis finibus. Cras placerat magna leo. Nam consectetur fermentum ornare.' },
    { id: 3, slug: 'e3-musthave-overview', heading: 'E3:MUSTHAVE OVERVIEW', cover: '/images/kemang_cover.png', date: '21 January, 2022', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend mi vitae metus rutrum feugiat. Nam ultricies quis libero at laoreet. Aliquam interdum molestie purus, eget auctor eros faucibus non. Nam eget risus a nisl tempus interdum vel et nulla. Etiam vehicula magna non cursus faucibus. Mauris ullamcorper tristique ante, ut facilisis est luctus vel. Integer nibh libero, dignissim nec magna ac, mattis vehicula diam. Proin a dolor vel nulla eleifend dignissim. </br> </br> Sed non augue dictum, tempor ligula ac, pharetra sapien. Duis gravida, libero eget accumsan congue, purus leo aliquet tortor, eu ultricies mauris quam nec lacus. Integer hendrerit, mauris ac fermentum vestibulum, ex lacus dignissim ligula, a porttitor mi libero sed metus. Etiam iaculis maximus justo non blandit. Donec ultrices nibh nec ipsum mattis, eu tempus lectus lacinia. Aliquam lorem diam, convallis id dapibus vitae, placerat sed enim. Donec rhoncus, tellus vel pharetra elementum, ligula neque ultricies enim, eget imperdiet odio augue at nibh. Morbi rhoncus eros eu facilisis commodo. Sed lorem turpis, auctor at justo vestibulum, vulputate ultrices lectus. Proin hendrerit luctus suscipit. Vestibulum lobortis nulla ut odio rhoncus, in aliquam sem rhoncus. Cras pulvinar sagittis finibus. Cras placerat magna leo. Nam consectetur fermentum ornare.' },
  ];

  // Cari data berdasarkan slug
  const currentBlog = blogData.find((blog) => blog.slug === slug);

  const filteredBlogData = blogData.filter((blog_item) => blog_item.slug !== slug);

  return (
    <>
        {currentBlog ? (
          <>
            <div className={style.banner_blog}>
              <Image
                src={currentBlog.cover}
                fill
                style={{ objectFit: 'cover' }}
                alt={currentBlog.heading}
              />
            </div>
            <div className={style.blog_content}>
                <div className={style.blog_heading}>
                  <h1>{currentBlog.heading}</h1>
                    <span>{currentBlog.date}</span>
                </div>
                <div className={style.blog_desc}>
                  <p dangerouslySetInnerHTML={{ __html: currentBlog.content }} />
                </div>
            </div>
            <div className={style.other_post}>
              <div className={style.other_post_heading}>
                <h1>{t('other')}</h1>
              </div>
              <div className={style.list_blog_layout}>
                {filteredBlogData.map((blog_item) => (
                  <div className={style.list_box_blog} key={blog_item.id}>
                    <div className={style.list_img_blog}>
                      <Image
                        src={blog_item.cover}
                        fill
                        style={{ objectFit: 'cover' }}
                        alt={blog_item.heading}
                      />
                    </div>
                    <div className={style.list_content_blog}>
                      <div className={style.list_heading_blog}>
                        <h3>{blog_item.heading}</h3>
                        <span>{blog_item.date}</span>
                      </div>
                      <div className={style.list_btn_blog}>
                        <Link href={`/blog/${blog_item.slug}`}>
                          <button>{t('view')}</button>
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
