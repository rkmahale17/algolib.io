import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getDynamicSupabaseClient } from "@/lib/supabaseConfig";
import type { SupabaseClient } from "@supabase/supabase-js";

interface FeatureFlagContextType {
  flags: Record<string, boolean>;
  isLoading: boolean;
  refreshFlags: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider = ({ children }: { children: ReactNode }) => {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const clientRef = useRef<SupabaseClient | null>(null);

  const getClient = async (): Promise<SupabaseClient | null> => {
    // Try to use the main supabase client first
    if (supabase) {
      return supabase;
    }
    
    // Fallback to dynamic client
    try {
      const dynamicClient = await getDynamicSupabaseClient();
      return dynamicClient;
    } catch (error) {
      console.error('Failed to get Supabase client:', error);
      return null;
    }
  };

  const fetchFlags = async () => {
    try {
      const client = await getClient();
      
      if (!client) {
        console.warn('No Supabase client available. Using default feature flags.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await client
        .from('feature_flags')
        .select('*');
      
      if (error) throw error;

      const flagMap: Record<string, boolean> = {};
      data?.forEach((flag: { key: string; is_enabled: boolean }) => {
        flagMap[flag.key] = flag.is_enabled;
      });
      
      setFlags(flagMap);
    } catch (error) {
      console.error("Error fetching feature flags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let channel: ReturnType<SupabaseClient['channel']> | null = null;

    const initializeRealtime = async () => {
      await fetchFlags();

      const client = await getClient();
      
      if (!client) {
        console.warn('Supabase client is not initialized. Realtime subscriptions disabled.');
        return;
      }

      clientRef.current = client;

      // specific subscription to table changes
      channel = client
        .channel('public:feature_flags')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'feature_flags' },
          (payload) => {
            console.log('Feature Flag update received:', payload);
            fetchFlags(); // Simple re-fetch strategy on any change
          }
        )
        .subscribe();
    };

    initializeRealtime();

    return () => {
      if (channel && clientRef.current) {
        clientRef.current.removeChannel(channel);
      }
    };
  }, []);

  return (
    <FeatureFlagContext.Provider value={{ flags, isLoading, refreshFlags: fetchFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagProvider");
  }
  return context;
};

export const useFeatureFlag = (key: string): boolean => {
  const { flags } = useFeatureFlags();
  return flags[key] ?? false; // Default to false if flag doesn't exist
};
