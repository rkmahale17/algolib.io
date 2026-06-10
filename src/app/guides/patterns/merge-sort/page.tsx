import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guidesData } from '@/data/guidesData';
import GuidesClient from '@/app/guides/GuidesClient';

export async function generateMetadata(): Promise<Metadata> {
  const guide = guidesData.flatMap((c) => c.guides).find((g) => g.slug === "merge-sort");
  
  if (!guide) {
    return {
      title: 'Guide Not Found | RulCode',
    };
  }

  return {
    title: `${guide.title} - DSA Guide | RulCode`,
    description: guide.description,
    openGraph: {
      title: `${guide.title} - DSA Guide | RulCode`,
      description: guide.description,
      url: `https://rulcode.com/guides/patterns/merge-sort`,
    },
  };
}

export default async function MergeSortPage() {
  const guide = guidesData.flatMap((c) => c.guides).find((g) => g.slug === "merge-sort");

  if (!guide) {
    notFound();
  }

  return <GuidesClient guide={guide} />;
}
