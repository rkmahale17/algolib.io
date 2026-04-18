'use client';

import dynamic from 'next/dynamic';

const Feedback = dynamic(() => import('@/pages/Feedback'), { ssr: false });

export default function FeedbackClient() {
  return <Feedback />;
}
