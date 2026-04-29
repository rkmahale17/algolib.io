import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const isAdminEnabled = process.env.NODE_ENV === 'development' || process.env.BUILD_ADMIN === 'true';

const AdminDashboardClient = isAdminEnabled 
  ? dynamic(() => import('@/admin/app-logic/AdminDashboardClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Admin Dashboard | RulCode',
  description: 'Internal management dashboard for RulCode.',
};

export default function AdminPage() {
  if (!isAdminEnabled) {
    notFound();
  }
  return <AdminDashboardClient />;
}
