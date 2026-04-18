import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service | RulCode',
  description: 'The terms and conditions for using the RulCode platform.',
};

export default function TermsPage() {
  return <TermsClient />;
}

