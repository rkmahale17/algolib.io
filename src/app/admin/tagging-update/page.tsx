import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const isAdminEnabled = process.env.NODE_ENV === 'development' || process.env.BUILD_ADMIN === 'true';

const AdminTaggingClient = isAdminEnabled 
  ? dynamic(() => import('@/admin/app-logic/AdminTaggingClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Tagging System | Admin',
  description: 'Manage algorithm tagging and premium status.',
};

export default function AdminTaggingPage() {
  if (!isAdminEnabled) {
    notFound();
  }
  return <AdminTaggingClient />;
}
