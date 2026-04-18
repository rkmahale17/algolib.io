import { Metadata } from 'next';
import StackMasterClient from './StackMasterClient';

export const metadata: Metadata = {
  title: 'Stack Master - Interactive Data Structures | RulCode',
  description: 'Master stack-based algorithms and data structures through gameplay.',
};

export default function StackMasterPage() {
  return <StackMasterClient />;
}
