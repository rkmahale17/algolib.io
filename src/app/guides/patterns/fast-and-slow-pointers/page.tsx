import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guidesData } from '@/data/guidesData';
import GuidesClient from '@/app/guides/GuidesClient';

export async function generateMetadata(): Promise<Metadata> {
  const guide = guidesData.flatMap((c) => c.guides).find((g) => g.slug === "fast-and-slow-pointers");
  
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
      url: `https://rulcode.com/guides/patterns/fast-and-slow-pointers`,
    },
  };
}

export default async function FastAndSlowPointersPage() {
  const guide = guidesData.flatMap((c) => c.guides).find((g) => g.slug === "fast-and-slow-pointers");

  if (!guide) {
    notFound();
  }

  return <GuidesClient guide={guide} />;
}
