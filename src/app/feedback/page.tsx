import { Metadata } from 'next';
import FeedbackClient from './FeedbackClient';

export const metadata: Metadata = {
  title: 'Feedback | RulCode',
  description: 'Help us improve RulCode by sharing your thoughts and bug reports.',
};

export default function FeedbackPage() {
  return <FeedbackClient />;
}
