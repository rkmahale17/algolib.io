import { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'My Profile | RulCode',
  description: 'Manage your RulCode account, profile settings, and subscription.',
};

export default function ProfilePage() {
  return <ProfileClient />;
}
