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

  if (profile.subscription_status === 'active') {
    if (profile.current_period_end && new Date(profile.current_period_end) < new Date()) {
      return false;
    }
    return true;
  }

  if ((profile.subscription_status === 'canceled' || profile.cancel_at_period_end) && profile.current_period_end) {
    return new Date(profile.current_period_end) > new Date();
  }

  return false;
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
