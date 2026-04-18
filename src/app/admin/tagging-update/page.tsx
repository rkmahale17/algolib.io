import { Metadata } from 'next';
import AdminTaggingClient from './AdminTaggingClient';

export const metadata: Metadata = {
  title: 'Tagging System | Admin',
  description: 'Update and manage algorithm tags.',
};

export default function AdminTaggingUpdatePage() {
  return <AdminTaggingClient />;
}
