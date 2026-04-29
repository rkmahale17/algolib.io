import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const isAdminEnabled = process.env.NODE_ENV === 'development' || process.env.BUILD_ADMIN === 'true';

const AdminProblemClient = isAdminEnabled 
  ? dynamic(() => import('@/admin/app-logic/AdminProblemClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Edit Algorithm | Admin',
  description: 'Modify algorithm details and implementations.',
};

export default async function EditAlgorithmPage(props: { params: Promise<{ id: string }> }) {
  if (!isAdminEnabled) {
    notFound();
  }
  const params = await props.params;
  return <AdminProblemClient />;
}
