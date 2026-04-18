import { Metadata } from 'next';
import AdminFeaturesClient from './AdminFeaturesClient';

export const metadata: Metadata = {
  title: 'Feature Flags | Admin',
  description: 'Manage experimental and restricted features.',
};

export default function AdminFeaturesPage() {
  return <AdminFeaturesClient />;
}
