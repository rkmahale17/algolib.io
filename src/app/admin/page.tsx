import { Metadata } from 'next';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | RulCode',
  description: 'Internal management dashboard for RulCode.',
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
