import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import ProblemDetailClient from './ProblemDetailClient';

interface ProblemPageProps {
  params: Promise<{ slug: string }>;
}

async function getAlgorithm(slug: string) {
  const { data, error } = await supabase
    .from('algorithms')
    .select('*')
    .eq('id', slug) // Existing logic uses ID as slug
    .maybeSingle();

  if (error || !data) return null;

  const metadata = data.metadata || {};
  const metadataObj = (typeof metadata === 'object' && metadata !== null ? metadata : {}) as Record<string, any>;
  
  return {
    ...data,
    ...metadataObj,
    metadata: data.metadata,
    slug: data.id, 
  };
}

export async function generateStaticParams() {
  const { data: algorithms } = await supabase
    .from('algorithms')
    .select('id');

  if (!algorithms) return [];

  return algorithms.map((algo) => ({
    slug: algo.id,
  }));
}

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const algorithm = await getAlgorithm(slug);

  if (!algorithm) {
    return {
      title: 'Problem Not Found | Rulcode',
    };
  }

  return {
    title: `${algorithm.name} - Algorithm Visualization & Solution | Rulcode`,
    description: algorithm.description || `Learn and visualize ${algorithm.name} with interactive examples and code solutions.`,
    keywords: `${algorithm.category || ''}, algorithms, ${algorithm.name}, coding interview, visualization`,
    openGraph: {
      title: `${algorithm.name} | Rulcode`,
      description: algorithm.description,
      images: [algorithm.image || 'https://rulcode.com/og-image.png'],
    },
  };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;
  const algorithm = await getAlgorithm(slug);

  if (!algorithm) {
    notFound();
  }

  return (
    <ProblemDetailClient 
      initialAlgorithm={algorithm} 
      slug={slug} 
    />
  );
}
