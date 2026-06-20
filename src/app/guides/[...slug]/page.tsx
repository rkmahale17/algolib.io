import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guidesData } from '@/data/guidesData';
import GuidesClient from '../GuidesClient';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const slugs: { slug: string[] }[] = [];
  
  guidesData.forEach((category) => {
    category.guides.forEach((guide) => {
      if (category.id === "fundamentals") {
        slugs.push({ slug: ["fundamentals", guide.slug] });
      } else if (category.id === "database") {
        slugs.push({ slug: ["database", guide.slug] });
      } else if (category.id === "time-complexity" || category.id === "space-complexity") {
        // Exclude because they are dedicated static routes
      } else {
        slugs.push({ slug: ["patterns", guide.slug] });
      }
    });
  });

  return slugs;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guideSlug = slug[slug.length - 1];
  const guide = guidesData.flatMap((c) => c.guides).find((g) => g.slug === guideSlug);
  
  if (!guide) {
    return {
      title: 'Guide Not Found | RulCode',
    };
  }

  const urlPath = slug.join("/");
  return {
    title: `${guide.title} - DSA Guide | RulCode`,
    description: guide.description,
    openGraph: {
      title: `${guide.title} - DSA Guide | RulCode`,
      description: guide.description,
      url: `https://rulcode.com/guides/${urlPath}`,
    },
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const guideSlug = slug[slug.length - 1];
  const guide = guidesData.flatMap((c) => c.guides).find((g) => g.slug === guideSlug);

  if (!guide) {
    notFound();
  }

  return <GuidesClient guide={guide} />;
}
