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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CACHE_KEY = 'rulcode_algorithms_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheData {
  algorithms: Algorithm[];
  timestamp: number;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [isAlgorithmsLoading, setIsAlgorithmsLoading] = useState(true);
  
  const [userAlgorithmData, setUserAlgorithmData] = useState<UserAlgorithmData[]>([]);
  const [isUserDataLoading, setIsUserDataLoading] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  const hasPremiumAccess = React.useMemo(() => {
    if (!profile) return false;
    
    if (profile.subscription_status === 'active') return true;
    
    // Trial access temporarily disabled for testing payment workflow
    /*
    if (profile.subscription_status === 'trialing' && profile.trial_end_date) {
      return new Date(profile.trial_end_date) > new Date();
    }
    */
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

  // Fetch algorithms from cache or database
  const fetchAlgorithms = async (forceRefresh = false) => {
    if (!supabase) {
      console.warn('Supabase not available, skipping algorithms fetch');
      setIsAlgorithmsLoading(false);
      return;
    }

    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cacheData: CacheData = JSON.parse(cached);
          const age = Date.now() - cacheData.timestamp;
          
          if (age < CACHE_DURATION) {
            setAlgorithms(cacheData.algorithms);
            setIsAlgorithmsLoading(false);
            return;
          }
        }
      }

      // Fetch from database
      setIsAlgorithmsLoading(true);
      const { data, error } = await supabase
        .from('algorithms')
        .select('*')
        .order('name');

      if (error) throw error;

      const transformedData = (data || []).map(algo => {
        const metadata = algo.metadata || {};
        const metadataObj = typeof metadata === 'object' && metadata !== null ? metadata : {};
        return {
          ...algo,
          ...metadataObj,
          metadata: algo.metadata,
        } as Algorithm;
      });

      setAlgorithms(transformedData);

      // Update cache
      const cacheData: CacheData = {
        algorithms: transformedData,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch algorithms on mount
  useEffect(() => {
    fetchAlgorithms();
  }, []);

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
