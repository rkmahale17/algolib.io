import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About | RulCode',
  description: 'Learn about the mission and team behind RulCode.',
};

export default function AboutPage() {
  return <AboutClient />;
}
