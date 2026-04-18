import { Metadata } from 'next';
import AdminMailClient from './AdminMailClient';

export const metadata: Metadata = {
  title: 'Mail System | Admin',
  description: 'Manage internal communications and mail logs.',
};

export default function AdminMailPage() {
  return <AdminMailClient />;
}
