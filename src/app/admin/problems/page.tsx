import { Metadata } from 'next';
import AdminAlgorithmsClient from './AdminAlgorithmsClient';

export const metadata: Metadata = {
  title: 'Manage Algorithms | Admin',
  description: 'Create and edit algorithms in the catalog.',
};

export default function AdminProblemsPage() {
  return <AdminAlgorithmsClient />;
}
