import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { XP_BADGES, ACTIVITY_BADGES, BadgeConfig } from '@/constants/xpConfig';
import { toast } from 'sonner';

export interface UseXPResult {
  totalXP: number;
  activeDaysEver: number;
  activeDaysThisYear: number;
  xpBadge: BadgeConfig | null;
  activityBadge: BadgeConfig | null;
  allBadges: BadgeConfig[];
  isLoading: boolean;
  refreshXP: () => Promise<void>;
}

export const useXP = (targetUserId?: string): UseXPResult => {
  const { user: authUser } = useApp();
  const activeUserId = targetUserId || authUser?.id;
  const [totalXP, setTotalXP] = useState(0);
  const [activeDaysEver, setActiveDaysEver] = useState(0);
  const [activeDaysThisYear, setActiveDaysThisYear] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Use a ref to track previous XP without triggering re-renders or useCallback updates
  const prevTotalXP = useRef<number | null>(null);

  const fetchXP = useCallback(async () => {
    if (!activeUserId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_xp_summary')
        .select('total_xp, active_days_ever, active_days_this_year')
        .eq('user_id', activeUserId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching XP summary:', error);
        return;
      }

      if (data) {
        setTotalXP(data.total_xp || 0);
        setActiveDaysEver(data.active_days_ever || 0);
        setActiveDaysThisYear(data.active_days_this_year || 0);
        
        // Handle Toasting for new XP Badges
        if (prevTotalXP.current !== null && data.total_xp > prevTotalXP.current) {
           const newBadges = XP_BADGES.filter(b => data.total_xp >= b.threshold && prevTotalXP.current! < b.threshold);
           newBadges.forEach(b => {
             toast(`🎉 You earned a new badge: ${b.name}!`, {
               description: b.description,
               icon: b.icon,
             });
           });
        }
        prevTotalXP.current = data.total_xp || 0;
      }
    } catch (err) {
      console.error('Exception fetching XP:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeUserId]);

  useEffect(() => {
    let mounted = true;
    
    if (activeUserId) {
      fetchXP();
    } else {
      setTotalXP(0);
      setActiveDaysEver(0);
      setActiveDaysThisYear(0);
      setIsLoading(false);
    }

    return () => { mounted = false; };
  }, [activeUserId, fetchXP]);


  // Compute earned badges
  const earnedXPBadges = XP_BADGES.filter(b => totalXP >= b.threshold);
  const earnedActivityBadges = ACTIVITY_BADGES.filter(b => activeDaysThisYear >= b.threshold);
  
  const xpBadge = earnedXPBadges.length > 0 ? earnedXPBadges[earnedXPBadges.length - 1] : null;
  const activityBadge = earnedActivityBadges.length > 0 ? earnedActivityBadges[earnedActivityBadges.length - 1] : null;

  return {
    totalXP,
    activeDaysEver,
    activeDaysThisYear,
    xpBadge,
    activityBadge,
    allBadges: [...earnedXPBadges, ...earnedActivityBadges],
    isLoading,
    refreshXP: fetchXP,
  };
};
