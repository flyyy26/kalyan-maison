import BlogDetailContent from '@/components/blog_detail_component/page';
import { getTranslations } from 'next-intl/server';

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations('blog');
  const translations = {
    other: t('other'),
    view: t('view'),
  };

  // Await params to get the slug
  const { slug } = await params;

  return <BlogDetailContent slug={slug} translations={translations} />;
}