// Global application context for state management and caching

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserAlgorithmData } from '@/types/userAlgorithmData';
import { getAllUserAlgorithmData } from '@/utils/userAlgorithmDataHelpers';

interface Algorithm {
  id: string;
  slug: string;
  name: string;
  category: string;
  difficulty: string;
  description: string;
  metadata?: any;
  [key: string]: any;
}

interface AppContextType {
  // Auth
  user: User | null;
  isAuthLoading: boolean;
  
  // Algorithms
  algorithms: Algorithm[];
  isAlgorithmsLoading: boolean;
  refreshAlgorithms: () => Promise<void>;
  
  // User Data
  userAlgorithmData: UserAlgorithmData[];
  isUserDataLoading: boolean;
  refreshUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CACHE_KEY = 'algolib_algorithms_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheData {
  algorithms: Algorithm[];
  timestamp: number;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [isAlgorithmsLoading, setIsAlgorithmsLoading] = useState(true);
  
  const [userAlgorithmData, setUserAlgorithmData] = useState<UserAlgorithmData[]>([]);
  const [isUserDataLoading, setIsUserDataLoading] = useState(false);

  // Fetch algorithms from cache or database
  const fetchAlgorithms = async (forceRefresh = false) => {
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
        return {
          ...algo,
          ...metadata,
          metadata: algo.metadata,
        };
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch algorithms on mount
  useEffect(() => {
    fetchAlgorithms();
  }, []);

  // Fetch user data when user changes
  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Subscribe to user_algorithm_data changes
  useEffect(() => {
    if (!user) return;

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
    isAuthLoading,
    algorithms,
    isAlgorithmsLoading,
    refreshAlgorithms: () => fetchAlgorithms(true),
    userAlgorithmData,
    isUserDataLoading,
    refreshUserData: fetchUserData,
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
