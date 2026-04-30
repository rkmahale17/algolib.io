import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import { IS_ADMIN_ENABLED } from '@/admin/constants';

const AdminSimulatorClient = IS_ADMIN_ENABLED 
  ? dynamic(() => import('@/admin/app-logic/AdminSimulatorClient'))
  : () => { notFound(); return null; };

export const metadata: Metadata = {
  title: 'Admin Simulator | RulCode',
  description: 'Internal tool for testing and simulating algorithms.',
};

export default function AdminSimulatorPage() {
  if (!IS_ADMIN_ENABLED) {
    notFound();
  }
  return <AdminSimulatorClient />;
}
