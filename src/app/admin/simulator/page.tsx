import { Metadata } from 'next';
import AdminSimulatorClient from './AdminSimulatorClient';

export const metadata: Metadata = {
  title: 'Admin Simulator | RulCode',
  description: 'Simulate and test algorithm execution flows.',
};

export default function AdminSimulatorPage() {
  return <AdminSimulatorClient />;
}
