'use client';

/**
 * PostHogIdentify.tsx
 *
 * Reactively identifies (or resets) the PostHog user whenever
 * the Redux auth state changes. Uses the same user/profile objects
 * that AppContext already fetches — no extra Supabase calls.
 *
 * Render this once inside the provider tree (after AppProvider).
 */

import { useEffect, useRef } from 'react';
import { usePostHog } from '@posthog/react';
import { useAppSelector } from '@/store/hooks';
import { identifyUser, resetUser } from '@/lib/analytics';

export default function PostHogIdentify(): null {
  const posthog = usePostHog();
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.profile);
  const lastIdentifiedId = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog) return;

    if (user?.id) {
      // Only call identify if the user or important profile data changed
      const plan = profile?.subscription_tier ?? 'free';
      const status = profile?.subscription_status ?? 'none';
      const isAdmin = profile?.role === 'admin';
      
      const currentIdState = `${user.id}-${plan}-${status}-${isAdmin}`;
      if (lastIdentifiedId.current === currentIdState) return;
      lastIdentifiedId.current = currentIdState;

      identifyUser(posthog, user.id, {
        email: user.email,
        plan: plan,
        subscription_status: status,
        is_admin: isAdmin,
      });
    } else {
      // User signed out — reset PostHog identity
      if (lastIdentifiedId.current !== null) {
        lastIdentifiedId.current = null;
        resetUser(posthog);
      }
    }
  }, [user?.id, user?.email, profile?.subscription_tier, profile?.subscription_status, profile?.role, posthog]);

  return null;
}
