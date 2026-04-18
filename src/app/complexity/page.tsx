import { Metadata } from 'next';
import ComplexityClient from './ComplexityClient';

export const metadata: Metadata = {
  title: 'Big O Time Complexity | RulCode',
  description: 'Learn about time and space complexity with interactive visualizations.',
};

export default function ComplexityPage() {
  return <ComplexityClient />;
}
