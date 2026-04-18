import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign In | RulCode',
  description: 'Log in to your RulCode account to continue mastering algorithms and data structures through interactive visualizations.',
};

export default function LoginPage() {
  return <LoginClient />;
}
