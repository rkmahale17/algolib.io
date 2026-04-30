import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import { IS_ADMIN_ENABLED } from '@/admin/constants';

const AdminDashboardClient = IS_ADMIN_ENABLED 
  ? dynamic(() => import('@/admin/app-logic/AdminDashboardClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Admin Dashboard | RulCode',
  description: 'Internal management dashboard for RulCode.',
};

export default function AdminPage() {
  if (!IS_ADMIN_ENABLED) {
    notFound();
  }
  return <AdminDashboardClient />;
}
