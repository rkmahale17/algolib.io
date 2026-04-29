import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const isAdminEnabled = process.env.NODE_ENV === 'development' || process.env.BUILD_ADMIN === 'true';

const AdminAlgorithmsClient = isAdminEnabled 
  ? dynamic(() => import('@/admin/app-logic/AdminAlgorithmsClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Manage Algorithms | Admin',
  description: 'Create and edit algorithms in the catalog.',
};

export default function AdminProblemsPage() {
  if (!isAdminEnabled) {
    notFound();
  }
  return <AdminAlgorithmsClient />;
}
