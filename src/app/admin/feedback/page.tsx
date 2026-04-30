import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import { IS_ADMIN_ENABLED } from '@/admin/constants';

const FeedbackAdminClient = IS_ADMIN_ENABLED 
  ? dynamic(() => import('@/admin/app-logic/FeedbackAdminClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Manage Feedback | Admin',
  description: 'Review and manage user feedback and bug reports.',
};

export default function AdminFeedbackPage() {
  if (!IS_ADMIN_ENABLED) {
    notFound();
  }
  return <FeedbackAdminClient />;
}
