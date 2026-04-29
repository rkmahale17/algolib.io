import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const isAdminEnabled = process.env.NODE_ENV === 'development' || process.env.BUILD_ADMIN === 'true';

const FeedbackAdminClient = isAdminEnabled 
  ? dynamic(() => import('@/admin/app-logic/FeedbackAdminClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Manage Feedback | Admin',
  description: 'Review and manage user feedback and bug reports.',
};

export default function AdminFeedbackPage() {
  if (!isAdminEnabled) {
    notFound();
  }
  return <FeedbackAdminClient />;
}
