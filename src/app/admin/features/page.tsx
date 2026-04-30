import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import { IS_ADMIN_ENABLED } from '@/admin/constants';

const AdminFeaturesClient = IS_ADMIN_ENABLED 
  ? dynamic(() => import('@/admin/app-logic/AdminFeaturesClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Feature Flags | Admin',
  description: 'Manage experimental and restricted features.',
};

export default function AdminFeaturesPage() {
  if (!IS_ADMIN_ENABLED) {
    notFound();
  }
  return <AdminFeaturesClient />;
}
