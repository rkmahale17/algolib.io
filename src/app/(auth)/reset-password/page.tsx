import { Metadata } from 'next';
import ResetPasswordClient from './ResetPasswordClient';

export const metadata: Metadata = {
  title: 'Reset Password | RulCode',
  description: 'Reset your RulCode account password.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
