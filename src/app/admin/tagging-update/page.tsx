import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import { IS_ADMIN_ENABLED } from '@/admin/constants';

const AdminTaggingClient = IS_ADMIN_ENABLED 
  ? dynamic(() => import('@/admin/app-logic/AdminTaggingClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Tagging System | Admin',
  description: 'Manage algorithm tagging and premium status.',
};

export default function AdminTaggingPage() {
  if (!IS_ADMIN_ENABLED) {
    notFound();
  }
  return <AdminTaggingClient />;
}
