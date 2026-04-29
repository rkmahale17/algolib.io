import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const isAdminEnabled = process.env.NODE_ENV === 'development' || process.env.BUILD_ADMIN === 'true';

const AdminProblemClient = isAdminEnabled 
  ? dynamic(() => import('@/admin/app-logic/AdminProblemClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'New Algorithm | Admin',
  description: 'Create a new algorithm for the catalog.',
};

export default function AdminNewProblemPage() {
  if (!isAdminEnabled) {
    notFound();
  }
  return <AdminProblemClient />;
}
