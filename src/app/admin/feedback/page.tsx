import { Metadata } from 'next';
import FeedbackAdminClient from './FeedbackAdminClient';

export const metadata: Metadata = {
  title: 'Manage Feedback | Admin',
  description: 'Review and manage user feedback and bug reports.',
};

export default function FeedbackAdminPage() {
  return <FeedbackAdminClient />;
}
