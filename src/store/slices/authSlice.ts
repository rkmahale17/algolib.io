import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/profile';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthLoading: boolean;
  hasPremiumAccess: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthLoading: true,
  hasPremiumAccess: false,
};

const calculatePremiumAccess = (profile: Profile | null): boolean => {
  if (!profile) return false;

  const status = profile.subscription_status;
  const premiumStatuses = ['active', 'on_trial', 'trialing', 'paid', 'past_due', 'canceled', 'cancelled'];

  if (!premiumStatuses.includes(status as string)) {
    return false;
  }

  // Date-based access validation
  const now = new Date();

  // 1. If strictly in trial status, check trial_end_date
  if (status === 'trialing' || status === 'on_trial') {
    if (profile.trial_end_date && new Date(profile.trial_end_date) < now) {
      return false; // Trial expired
    }
    return true;
  }

  // 2. For paid/active/canceled, check current_period_end
  // We allow a small 24h buffer for webhook processing delays
  if (profile.current_period_end) {
    const expiry = new Date(profile.current_period_end);
    const buffer = 24 * 60 * 60 * 1000; // 24 hours buffer

    if (expiry.getTime() + buffer < now.getTime()) {
      // One last check: if they have a future trial date (e.g. from a separate trial period), they still have access
      if (profile.trial_end_date && new Date(profile.trial_end_date) > now) {
        return true;
      }
      return false;
    }
  }

  return true;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      if (!action.payload) {
        state.profile = null;
        state.hasPremiumAccess = false;
      }
    },
    setProfile(state, action: PayloadAction<Profile | null>) {
      state.profile = action.payload;
      state.hasPremiumAccess = calculatePremiumAccess(action.payload);
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isAuthLoading = action.payload;
    },
  },
});

export const { setUser, setProfile, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
