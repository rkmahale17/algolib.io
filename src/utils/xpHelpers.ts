import { supabase } from '@/integrations/supabase/client';
import { XP_VALUES, XPEventType } from '@/constants/xpConfig';
import { toast } from 'sonner';

/**
 * Awards XP to a user for a specific event.
 * Automatically handles idempotency using the unique constraints on `user_xp_events`.
 *
 * @param userId - The user ID
 * @param eventType - The type of event (determines XP amount)
 * @param algorithmId - Optional. Required for problem-specific events to prevent double counting.
 * @returns { awarded: boolean; xp: number } - awarded is true if XP was successfully added (not a duplicate)
 */
export async function awardXP(
  userId: string,
  eventType: XPEventType,
  algorithmId?: string
): Promise<{ awarded: boolean; xp: number }> {
  if (!supabase) {
    console.warn('Supabase not available');
    return { awarded: false, xp: 0 };
  }

  // Use the prefix if it's a difficulty-specific event. We store the raw eventType in DB.
  let dbEventType = eventType;
  if (eventType.startsWith('problem_solved')) {
    dbEventType = 'problem_solved'; 
  }

  const xpAmount = XP_VALUES[eventType];
  
  if (dbEventType !== 'daily_login' && !algorithmId) {
    console.error('algorithmId is required for problem events');
    return { awarded: false, xp: 0 };
  }

  try {
    const { error, data } = await supabase
      .from('user_xp_events')
      .insert({
        user_id: userId,
        event_type: dbEventType,
        algorithm_id: dbEventType === 'daily_login' ? null : algorithmId,
        xp_awarded: xpAmount,
      })
      .select();

    // Postgres throws error code '23505' for unique violation (meaning they already got XP for this)
    if (error) {
      if (error.code === '23505') {
        return { awarded: false, xp: 0 }; // Duplicate, expected behavior
      }
      console.error('Error awarding XP:', error);
      return { awarded: false, xp: 0 };
    }
    
    // Successfully awarded
    if (xpAmount > 0) {
      toast.success(`+${xpAmount} Points`, {
        description: `Earned for ${dbEventType.replace(/_/g, ' ')}`,
        icon: '🌟',
      });
    }
    return { awarded: true, xp: xpAmount };

  } catch (err) {
    console.error('Exception awarding XP:', err);
    return { awarded: false, xp: 0 };
  }
}
