import { Metadata } from 'next';
import PublicProfileClient from './PublicProfileClient';

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username}'s Algorithm Journey | RulCode`,
    description: `Check out ${username}'s progress on RulCode. Mastering data structures and algorithms with interactive visualizations.`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  return <PublicProfileClient username={username} />;
}

