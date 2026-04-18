
import { Metadata } from 'next';
import AdminProblemClient from '../AdminProblemClient';

export const metadata: Metadata = {
  title: 'Edit Algorithm | Admin',
  description: 'Modify algorithm details and implementations.',
};

export default async function EditAlgorithmPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <AdminProblemClient />;
}
