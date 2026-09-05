import { Metadata } from 'next';
import { Suspense } from 'react';
import ProblemsClient from '@/app/dsa/problems/ProblemsClient';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Frontend Questions - RulCode",
  description: "Master JavaScript and TypeScript through practical coding challenges. Practice implementing utility functions, polyfills, DOM manipulation, and more.",
  openGraph: {
    title: "Frontend Questions - RulCode",
    description: "Master JavaScript and TypeScript through practical coding challenges. Practice implementing utility functions, polyfills, DOM manipulation, and more.",
    url: 'https://rulcode.com/frontend/questions',
  }
};

export default async function FrontendQuestionsPage() {
  const isFrontendEnabled = true; // Feature launched
  let isAdmin = false;

  try {
    const { createClient } = await import('@/utils/supabase/server');
    const supabaseServer = await createClient();

    // Check user admin role
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (user) {
      const { data: profile } = await supabaseServer
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (profile?.role === 'admin') {
        isAdmin = true;
      }
    }
  } catch (e) {
    // Fallback for build time
  }

  if (!isFrontendEnabled && !isAdmin) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Suspense fallback={<div className="p-8 animate-pulse">Loading Frontend Questions...</div>}>
        <ProblemsClient 
          listType="frontend-basics"
          problemType="frontend"
          title="Frontend Questions"
          description="Master JavaScript and TypeScript through practical coding challenges. Practice implementing utility functions, polyfills, DOM manipulation, and more."
          progressTitle="Frontend Progress"
          icon="code"
        />
      </Suspense>
    </div>
  );
}
