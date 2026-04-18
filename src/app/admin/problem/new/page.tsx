
import { Metadata } from 'next';
import AdminProblemClient from '../AdminProblemClient';

export const metadata: Metadata = {
  title: 'New Algorithm | Admin',
  description: 'Add a new algorithm to the library.',
};

export default function NewAlgorithmPage() {
  return <AdminProblemClient />;
}
