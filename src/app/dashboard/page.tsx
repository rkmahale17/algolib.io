import { redirect } from 'next/navigation';

/**
 * Dashboard redirects to the user's profile setup or public profile.
 * The /profile route handles the specific redirection logic based on username presence.
 */
export default function DashboardPage() {
  redirect('/profile');
}
