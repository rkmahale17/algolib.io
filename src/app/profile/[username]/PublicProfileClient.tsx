'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SubmissionHeatmap } from "@/components/profile/SubmissionHeatmap";
import { ProgressStats } from "@/components/profile/ProgressStats";
import { RecentSubmissions } from "@/components/profile/RecentSubmissions";
import { PremiumLoader } from "@/components/PremiumLoader";
import type { Profile } from "@/types/profile";
import { DIFFICULTY_MAP } from "@/types/algorithm";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, UserX, ChevronDown } from "lucide-react";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { useApp } from "@/contexts/AppContext";
import { useAlgorithms } from "@/hooks/useAlgorithms";

// Helper to calculate streaks (current and max)
const calculateStreaks = (dates: string[]) => {
  if (!dates.length) return { current: 0, max: 0 };

  const sortedDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

  // 1. Calculate Current Streak
  let currentStreak = 0;
  if (sortedDates.includes(todayStr) || sortedDates.includes(yesterdayStr)) {
    let currentDate = new Date(sortedDates[0] === todayStr ? todayStr : yesterdayStr);
    for (let i = 0; i < sortedDates.length; i++) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      if (sortedDates.includes(dateStr)) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // 2. Calculate Max Streak
  let maxStreak = 0;
  let tempStreak = 1;

  // Sort ascending for max streak calculation
  const datesAsc = [...new Set(dates)].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  if (datesAsc.length === 1) maxStreak = 1;

  for (let i = 1; i < datesAsc.length; i++) {
    const prev = new Date(datesAsc[i - 1]);
    const curr = new Date(datesAsc[i]);
    const diffTime = Math.abs(curr.getTime() - prev.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
    } else {
      maxStreak = Math.max(maxStreak, tempStreak);
      tempStreak = 1;
    }
  }
  maxStreak = Math.max(maxStreak, tempStreak);

  return { current: currentStreak, max: maxStreak };
};

interface ProfileStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  heatmapData: { date: string; count: number }[];
  recentSubmissions: any[];
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
}

interface PublicProfileClientProps {
  username: string;
}

const PublicProfileClient = ({ username }: PublicProfileClientProps) => {
  const router = useRouter();
  const { user: currentUser } = useApp();
  const { data: algoMeta } = useAlgorithms();
  const allAlgorithms = algoMeta?.algorithms;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"not_found" | "private" | "not_authenticated" | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [visibleSubmissionsTotal, setVisibleSubmissionsTotal] = useState(15);
  const [algoData, setAlgoData] = useState<any[]>([]);

  // Memoized stats calculation
  const stats = useMemo<ProfileStats>(() => {
    if (!algoData || !allAlgorithms) {
      return {
        totalSolved: 0, totalQuestions: 0,
        easySolved: 0, easyTotal: 0,
        mediumSolved: 0, mediumTotal: 0,
        hardSolved: 0, hardTotal: 0,
        heatmapData: [], recentSubmissions: [],
        currentStreak: 0, longestStreak: 0, totalActiveDays: 0
      };
    }

    let easyCount = 0, medCount = 0, hardCount = 0;
    let heatmapRaw: Record<string, number> = {};
    let recents: any[] = [];
    const activityDates: string[] = [];

    const algoMap = new Map();
    allAlgorithms.forEach((a) => algoMap.set(a.id, a));

    algoData.forEach((entry) => {
      if (entry.completed) {
        const algo = algoMap.get(entry.algorithm_id);
        const rawDiff = algo?.difficulty?.toLowerCase() || "";
        const diff = (DIFFICULTY_MAP[rawDiff] || rawDiff).toLowerCase();

        if (diff === "easy") easyCount++;
        else if (diff === "medium") medCount++;
        else if (diff === "hard") hardCount++;
      }

      const subs = (entry.submissions as any[]) || [];
      subs.forEach((s) => {
        const dateKey = format(new Date(s.timestamp), "yyyy-MM-dd");
        heatmapRaw[dateKey] = (heatmapRaw[dateKey] || 0) + 1;
        activityDates.push(dateKey);

        recents.push({
          id: s.id,
          algorithmId: entry.algorithm_id,
          algorithmName: algoMap.get(entry.algorithm_id)?.name || entry.algorithm_id,
          status: s.status,
          timestamp: s.timestamp,
          language: s.language,
        });
      });
    });

    const { current: currentStreak, max: maxStreak } = calculateStreaks(activityDates);

    let totalEasy = 0, totalMed = 0, totalHard = 0;
    allAlgorithms.forEach((a) => {
      const rawDiff = a.difficulty?.toLowerCase() || "";
      const diff = (DIFFICULTY_MAP[rawDiff] || rawDiff).toLowerCase();
      if (diff === "easy") totalEasy++;
      else if (diff === "medium") totalMed++;
      else if (diff === "hard") totalHard++;
    });

    return {
      totalSolved: easyCount + medCount + hardCount,
      totalQuestions: allAlgorithms.length,
      easySolved: easyCount,
      easyTotal: totalEasy,
      mediumSolved: medCount,
      mediumTotal: totalMed,
      hardSolved: hardCount,
      hardTotal: totalHard,
      heatmapData: Object.entries(heatmapRaw).map(([date, count]) => ({ date, count })),
      recentSubmissions: recents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      currentStreak,
      longestStreak: maxStreak,
      totalActiveDays: Object.keys(heatmapRaw).length
    };
  }, [algoData, allAlgorithms]);

  useEffect(() => {
    if (username) {
      fetchPublicProfile();
    }
  }, [username, currentUser]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const authUserId = currentUser?.id || (await supabase.auth.getUser()).data.user?.id;

      // Fetch profile by username with optimized columns
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, bio, is_public, subscription_status, subscription_tier, location, website_url, github_url, twitter_url, linkedin_url")
        .eq("username", username)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profileData) {
        setError("not_found");
        return;
      }

      // Check if the user is viewing their own profile
      const isOwn = authUserId === profileData.id;
      const isPublic = (profileData as any).is_public;

      if (!isOwn && !isPublic) {
        setError("private");
        return;
      }

      // Filter sensitive data
      const publicProfile: Profile = {
        ...profileData,
        is_public: !!isPublic,
        email: "", 
      } as Profile;

      setProfile(publicProfile);
      setIsOwnProfile(isOwn);

      // Fetch stats with optimized columns
      const { data: userAlgoData, error: algoError } = await supabase
        .from("user_algorithm_data")
        .select("algorithm_id, completed, submissions")
        .eq("user_id", profileData.id);

      if (algoError) throw algoError;
      setAlgoData(userAlgoData || []);

    } catch (error) {
      console.error("Error fetching public profile:", error);
      setError("not_found");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    setIsEditOpen(false);
    fetchPublicProfile(); 
  };

  if (loading) return <PremiumLoader text="Loading Profile..." />;

  // Error states (Simplified for brevity, similar to legacy)
  if (error === "not_found") return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-12">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <Button onClick={() => router.push('/')}>Go Home</Button>
      </Card>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <ProfileHeader profile={profile} onEdit={() => setIsEditOpen(true)} isOwnProfile={isOwnProfile} />
          </aside>

          <div className="flex-1 min-w-0 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-muted-foreground mb-2">Total Solved</div>
                <div className="text-3xl font-bold text-primary">{stats.totalSolved}</div>
                <div className="text-xs text-muted-foreground mt-1">out of {stats.totalQuestions} questions</div>
              </div>
              <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-muted-foreground mb-2">Current Streak</div>
                <div className="text-3xl font-bold text-orange-500">{stats.currentStreak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-border/40"><h3 className="font-semibold text-sm">Activity Heatmap</h3></div>
                  <div className="p-4"><SubmissionHeatmap submissions={stats.heatmapData} /></div>
                </div>

                <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-border/40"><h3 className="font-semibold text-sm">Recent Submissions</h3></div>
                  <div className="p-2">
                    <RecentSubmissions submissions={stats.recentSubmissions.slice(0, visibleSubmissionsTotal)} />
                    {stats.recentSubmissions.length > visibleSubmissionsTotal && (
                      <div className="p-4 flex justify-center border-t border-border/40">
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary gap-2" onClick={() => setVisibleSubmissionsTotal(prev => prev + 15)}>
                          <ChevronDown className="w-3 h-3" />Load More Submissions
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/40"><h3 className="font-semibold text-sm">Progress</h3></div>
                  <ProgressStats
                    totalSolved={stats.totalSolved} totalQuestions={stats.totalQuestions}
                    easySolved={stats.easySolved} easyTotal={stats.easyTotal}
                    mediumSolved={stats.mediumSolved} mediumTotal={stats.mediumTotal}
                    hardSolved={stats.hardSolved} hardTotal={stats.hardTotal}
                    variant="vertical"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOwnProfile && isEditOpen && (
        <EditProfileDialog open={isEditOpen} onOpenChange={setIsEditOpen} profile={profile} onSave={handleProfileUpdate} />
      )}
    </div>
  );
};

export default PublicProfileClient;
