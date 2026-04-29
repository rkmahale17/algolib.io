import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const isAdminEnabled = process.env.NODE_ENV === 'development' || process.env.BUILD_ADMIN === 'true';

const AdminSimulatorClient = isAdminEnabled 
  ? dynamic(() => import('@/admin/app-logic/AdminSimulatorClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Admin Simulator | RulCode',
  description: 'Internal tool for testing and simulating algorithms.',
};

export default function AdminSimulatorPage() {
  if (!isAdminEnabled) {
    notFound();
  }
  return <AdminSimulatorClient />;
}
