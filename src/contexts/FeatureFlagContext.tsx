import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeatureFlag } from "@/types/featureFlags";
import { toast } from "sonner";

interface FeatureFlagContextType {
  flags: Record<string, boolean>;
  isLoading: boolean;
  refreshFlags: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider = ({ children }: { children: ReactNode }) => {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlags = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    
    try {
      // @ts-ignore - feature_flags table is new and types are not regenerated yet
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*');
      
      if (error) throw error;

      const flagMap: Record<string, boolean> = {};
      data?.forEach(flag => {
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
    fetchFlags();

    if (!supabase) return;

    // specific subscription to table changes
    const channel = supabase
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

    return () => {
      supabase.removeChannel(channel);
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
