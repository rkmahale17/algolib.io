import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import { IS_ADMIN_ENABLED } from '@/admin/constants';

const AdminProblemClient = IS_ADMIN_ENABLED 
  ? dynamic(() => import('@/admin/app-logic/AdminProblemClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'New Algorithm | Admin',
  description: 'Create a new algorithm for the catalog.',
};

export default function AdminNewProblemPage() {
  if (!IS_ADMIN_ENABLED) {
    notFound();
  }
  return <AdminProblemClient />;
}
