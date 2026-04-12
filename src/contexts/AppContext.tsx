// Global application context for state management and caching

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserAlgorithmData } from '@/types/userAlgorithmData';
import type { Profile } from '@/types/profile';
import { getAllUserAlgorithmData } from '@/utils/userAlgorithmDataHelpers';

interface Algorithm {
  id: string;
  slug?: string;
  name: string;
  category: string;
  difficulty: string;
  description: string;
  serial_no?: number;
  metadata?: any;
  [key: string]: any;
}

interface AppContextType {
  // Auth & Profile
  user: User | null;
  profile: Profile | null;
  isAuthLoading: boolean;
  hasPremiumAccess: boolean;

  // Algorithms
  algorithms: Algorithm[];
  isAlgorithmsLoading: boolean;
  refreshAlgorithms: () => Promise<void>;

  // User Data
  userAlgorithmData: UserAlgorithmData[];
  isUserDataLoading: boolean;
  refreshUserData: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  activateTrial: () => Promise<void>;

  // List Context
  activeListType: string;
  setActiveListType: (type: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CACHE_KEY = 'rulcode_algorithms_v2_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheData {
  algorithms: Algorithm[];
  timestamp: number;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // Track in-flight profile fetch to avoid redundant calls
  const profileFetchInProgress = React.useRef<string | null>(null);

  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [isAlgorithmsLoading, setIsAlgorithmsLoading] = useState(true);

  const [userAlgorithmData, setUserAlgorithmData] = useState<UserAlgorithmData[]>([]);
  const [isUserDataLoading, setIsUserDataLoading] = useState(false);

  const [activeListType, setActiveListType] = useState<string>(() => {
    return localStorage.getItem('rulcode_active_list_type') || 'all';
  });

  const updateActiveListType = (type: string) => {
    setActiveListType(type);
    localStorage.setItem('rulcode_active_list_type', type);
  };

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) return;
    
    // Check if we already have the profile for this user and it's being fetched
    if (profileFetchInProgress.current === userId) {
      return;
    }

    try {
      profileFetchInProgress.current = userId;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, subscription_status, subscription_tier, trial_end_date, current_period_end, cancel_at_period_end')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data as any as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      profileFetchInProgress.current = null;
    }
  }, []);

  const hasPremiumAccess = React.useMemo(() => {
    if (!profile) return false;

    if (profile.subscription_status === 'active') {
      // Even if active, if we have an end date that passed, respect it
      if (profile.current_period_end && new Date(profile.current_period_end) < new Date()) {
        return false;
      }
      return true;
    }

    // Handle Grace period for canceled subscriptions
    if ((profile.subscription_status === 'canceled' || profile.cancel_at_period_end) && profile.current_period_end) {
      return new Date(profile.current_period_end) > new Date();
    }

    return false;
  }, [profile]);

  const activateTrial = async () => {
    if (!user || !profile) return;
    if (profile.trial_end_date) {
      // toast.error("You have already used your trial."); // Assuming toast is available
      console.error("You have already used your trial.");
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'trialing',
        trial_end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('id', user.id);

    if (error) {
      // toast.error("Failed to activate trial"); // Assuming toast is available
      console.error("Failed to activate trial", error);
    } else {
      // toast.success("Trial activated! Enjoy 10 days of Premium."); // Assuming toast is available
      console.log("Trial activated! Enjoy 10 days of Premium.");
      await fetchProfile(user.id);
    }
  };

  // Fetch algorithms from database
  const fetchAlgorithms = async (forceRefresh = false) => {
    if (!supabase) {
      console.warn('Supabase not available, skipping algorithms fetch');
      setIsAlgorithmsLoading(false);
      return;
    }

    try {
      // Fetch from database - SELECT ONLY NECESSARY COLUMNS FOR LIST VIEW
      // Note: We no longer cache this list in localStorage to avoid QuotaExceededError
      setIsAlgorithmsLoading(true);
      const { data, error } = await supabase
        .from('algorithms')
        .select('id, name, title, category, difficulty, description, serial_no, metadata, list_type, time_complexity, space_complexity')
        .order('serial_no', { ascending: true, nullsFirst: false });

      if (error) throw error;

      const transformedData = (data || []).map(algo => {
        const metadata = algo.metadata || {};
        const metadataObj = typeof metadata === 'object' && metadata !== null ? metadata : {};
        return {
          ...algo,
          ...metadataObj,
          metadata: algo.metadata,
          // Map snake_case to camelCase for consistency with existing components
          timeComplexity: (algo as any).time_complexity,
          spaceComplexity: (algo as any).space_complexity,
          listType: (algo as any).list_type,
        } as Algorithm;
      });

      setAlgorithms(transformedData);

      // Cleanup old cache keys if they exist
      try {
        localStorage.removeItem('rulcode_algorithms_cache');
        localStorage.removeItem('rulcode_algorithms_v2_cache');
      } catch (e) {
        // Ignore cleanup errors
      }
    } catch (error) {
      console.error('Error fetching algorithms:', error);
    } finally {
      setIsAlgorithmsLoading(false);
    }
  };

// Fetch user algorithm data
const fetchUserData = async () => {
  if (!user) {
    setUserAlgorithmData([]);
    return;
  }

  try {
    setIsUserDataLoading(true);
    const data = await getAllUserAlgorithmData(user.id);
    setUserAlgorithmData(data);
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    setIsUserDataLoading(false);
  }
};

// Initialize auth
useEffect(() => {
  if (!supabase) {
    console.warn('Supabase not available, skipping authentication');
    setIsAuthLoading(false);
    return;
  }

  let mounted = true;

  const initSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (mounted) {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      }
      setIsAuthLoading(false);
    }
  };

  initSession();

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (!mounted) return;
    
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    
    if (currentUser) {
      // Only fetch profile on specific events to avoid redundant calls at boot
      // SIGNED_IN covers INITIAL_SESSION usually, but we also handle it in initSession
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        fetchProfile(currentUser.id);
      }
    } else {
      setProfile(null);
    }
  });

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, [fetchProfile]);

// Fetch algorithms on mount (Removed to avoid redundancy with React Query prefetch in App.tsx)
// useEffect(() => {
//   fetchAlgorithms();
// }, []);

// Fetch user data when user changes
// useEffect(() => {
//   fetchUserData();
// }, [user]);

// Subscribe to user_algorithm_data changes
useEffect(() => {
  if (!user || !supabase) return;

  const channel = supabase
    .channel('user_algorithm_data_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_algorithm_data',
        filter: `user_id=eq.${user.id}`,
      },
      () => {
        // Refetch user data when changes occur
        fetchUserData();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);

const value: AppContextType = {
  user,
  profile,
  isAuthLoading,
  hasPremiumAccess,
  algorithms,
  isAlgorithmsLoading,
  refreshAlgorithms: () => fetchAlgorithms(true),
  userAlgorithmData,
  isUserDataLoading,
  refreshUserData: fetchUserData,
  refreshProfile: useCallback(() => user ? fetchProfile(user.id) : Promise.resolve(), [user, fetchProfile]),
  activateTrial,
  activeListType,
  setActiveListType: updateActiveListType,
};

return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
