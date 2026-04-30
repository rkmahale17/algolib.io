import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import { IS_ADMIN_ENABLED } from '@/admin/constants';

const AdminProblemClient = IS_ADMIN_ENABLED 
  ? dynamic(() => import('@/admin/app-logic/AdminProblemClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Edit Algorithm | Admin',
  description: 'Modify algorithm details and implementations.',
};

export default async function EditAlgorithmPage(props: { params: Promise<{ id: string }> }) {
  if (!IS_ADMIN_ENABLED) {
    notFound();
  }
  const params = await props.params;
  return <AdminProblemClient />;
}
