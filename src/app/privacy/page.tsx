import { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | RulCode',
  description: 'Our commitment to protecting your personal data and privacy.',
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}

