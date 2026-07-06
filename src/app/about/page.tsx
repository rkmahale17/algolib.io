import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Rulcode',
  description: 'Learn about the mission and team behind Rulcode.',
};

export default function AboutPage() {
  return <AboutClient />;
}
