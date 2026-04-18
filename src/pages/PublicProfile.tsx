"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SubmissionHeatmap } from "@/components/profile/SubmissionHeatmap";
import { ProgressStats } from "@/components/profile/ProgressStats";
import { RecentSubmissions } from "@/components/profile/RecentSubmissions";
import { PremiumLoader } from "@/components/PremiumLoader";
import type { Profile } from "@/types/profile";
import { DIFFICULTY_MAP } from "@/types/algorithm";
import { format } from "date-fns";
import { useProfileSEO } from "@/hooks/useProfileSEO";
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

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
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

  // Set SEO meta tags
  useProfileSEO(profile);

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
    if (!username) {
      navigate("/");
      return;
    }
    fetchPublicProfile();
  }, [username]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated first using existing state from context
      if (!currentUser) {
        // Fallback check in case the context is still loading
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("not_authenticated");
          return;
        }
      }
      
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

  // Error states
  if (error === "not_found") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-xl w-full animate-in fade-in zoom-in duration-500">
          <Card className="flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <CardContent className="pt-12 pb-16 text-center space-y-6 relative">
              <div className="relative inline-block mb-2">
                <div className="absolute inset-0 blur-2xl rounded-full animate-pulse" />
                <img src="/logo.svg" alt="RulCode" className="w-14 h-18" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font- bg-gradient-to-r from-white via-primary to-blue-400 bg-clip-text text-transparent">
                  Profile Not Found
                </h1>
                <p className="text-gray-400 text-base">User doesn't exist</p>
              </div>
              <div className="border border-primary/20 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <UserX className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground text-left">
                    The user <span className="text-primary font-mono">@{username}</span> doesn't exist or hasn't set up their profile yet.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
                <Button onClick={() => navigate("/")} variant="outline" size="lg" className="min-w-[140px]">
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error === "private") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-xl w-full animate-in fade-in zoom-in duration-500">
          <Card className="flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <CardContent className="pt-12 pb-16 text-center space-y-6 relative">
              <div className="relative inline-block mb-2">
                <div className="absolute inset-0 blur-2xl rounded-full animate-pulse" />
                <img src="/logo.svg" alt="RulCode" className="w-14 h-18" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font- bg-gradient-to-r from-white via-primary to-blue-400 bg-clip-text text-transparent">
                  Private Profile
                </h1>
                <p className="text-gray-400 text-base">This profile is not publicly accessible</p>
              </div>
              <div className="border border-primary/20 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground text-left">
                    This profile is set to private and cannot be viewed publicly. Only the profile owner can view their private profile.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
                <Button onClick={() => navigate("/")} variant="outline" size="lg" className="min-w-[140px]">
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error === "not_authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-xl w-full animate-in fade-in zoom-in duration-500">
          <Card className=" flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <CardContent className="pt-12 pb-16 text-center space-y-6 relative">
              <div className="relative inline-block mb-2">
                <div className="absolute inset-0 blur-2xl rounded-full animate-pulse" />
                <img src="/logo.svg" alt="RulCode" className="w-14 h-18" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font- bg-gradient-to-r from-white via-primary to-blue-400 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-gray-400 text-base">Continue exploring algorithmic journeys</p>
              </div>
              <div className="border border-primary/20 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground text-left">
                    Sign in to view detailed profiles, track progress, and connect with the RulCode community.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
                <Button onClick={() => navigate("/login")} size="lg" className="min-w-[140px]">
                  Sign In
                </Button>
                <Button onClick={() => navigate("/")} variant="outline" size="lg" className="min-w-[140px]">
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-80 shrink-0 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <ProfileHeader profile={profile} onEdit={() => setIsEditOpen(true)} isOwnProfile={isOwnProfile} />
          </aside>

          <div className="flex-1 min-w-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-muted-foreground mb-2">Total Solved</div>
                <div className="text-3xl font- text-primary">{stats.totalSolved}</div>
                <div className="text-xs text-muted-foreground mt-1">out of {stats.totalQuestions} questions</div>
              </div>
              <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-muted-foreground mb-2">Current Streak</div>
                <div className="text-3xl font- text-orange-500">{stats.currentStreak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
              </div>
              <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-muted-foreground mb-2">Max Streak</div>
                <div className="text-3xl font- text-amber-500">{stats.longestStreak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
              </div>
              <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-muted-foreground mb-2">Total Active Days</div>
                <div className="text-3xl font- text-green-500">{stats.totalActiveDays}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="space-y-6 lg:order-last">
                <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden lg:sticky lg:top-24">
                  <div className="px-5 py-4 border-b border-border/40"><h3 className="font-semibold text-sm">Progress by Difficulty</h3></div>
                  <ProgressStats
                    totalSolved={stats.totalSolved} totalQuestions={stats.totalQuestions}
                    easySolved={stats.easySolved} easyTotal={stats.easyTotal}
                    mediumSolved={stats.mediumSolved} mediumTotal={stats.mediumTotal}
                    hardSolved={stats.hardSolved} hardTotal={stats.hardTotal}
                    variant="vertical"
                  />
                </div>
              </div>

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

export default PublicProfile;
