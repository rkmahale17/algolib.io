import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const isAdminEnabled = process.env.NODE_ENV === 'development' || process.env.BUILD_ADMIN === 'true';

const AdminFeaturesClient = isAdminEnabled 
  ? dynamic(() => import('@/admin/app-logic/AdminFeaturesClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Feature Flags | Admin',
  description: 'Manage experimental and restricted features.',
};

export default function AdminFeaturesPage() {
  if (!isAdminEnabled) {
    notFound();
  }
  return <AdminFeaturesClient />;
}
