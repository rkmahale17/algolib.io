import { Metadata } from 'next';
import DocsClient from './DocsClient';

export const metadata: Metadata = {
  title: 'Compiler Docs | RulCode',
  description: 'Documentation for the RulCode online compiler and supported languages.',
};

export default function DocsPage() {
  return <DocsClient />;
}
