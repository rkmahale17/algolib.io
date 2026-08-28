import { Metadata } from 'next';
import ContentRightsClient from './ContentRightsClient';

export const metadata: Metadata = {
  title: 'Content Rights & Usage Policy | RulCode',
  description: "Learn about RulCode's content rights, embedded video usage, and original educational materials.",
  robots: 'noindex, follow',
};

export default function ContentRightsPage() {
  return <ContentRightsClient />;
}
