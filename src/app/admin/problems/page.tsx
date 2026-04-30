import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import { IS_ADMIN_ENABLED } from '@/admin/constants';

const AdminAlgorithmsClient = IS_ADMIN_ENABLED 
  ? dynamic(() => import('@/admin/app-logic/AdminAlgorithmsClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Manage Algorithms | Admin',
  description: 'Create and edit algorithms in the catalog.',
};

export default function AdminProblemsPage() {
  if (!IS_ADMIN_ENABLED) {
    notFound();
  }
  return <AdminAlgorithmsClient />;
}
