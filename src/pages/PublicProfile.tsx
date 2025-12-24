import { useEffect, useState } from "react";
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
import { Lock, UserX } from "lucide-react";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

// Helper to calculate streak
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
    const prev = new Date(datesAsc[i-1]);
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"not_found" | "private" | "not_authenticated" | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [stats, setStats] = useState<ProfileStats>({
    totalSolved: 0,
    totalQuestions: 0,
    easySolved: 0,
    easyTotal: 0,
    mediumSolved: 0,
    mediumTotal: 0,
    hardSolved: 0,
    hardTotal: 0,
    heatmapData: [],
  recentSubmissions: [],
  currentStreak: 0,
    longestStreak: 0,
    totalActiveDays: 0
  });

  // Set SEO meta tags
  useProfileSEO(profile);

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }
    fetchPublicProfile();
  }, [username]);

  const fetchPublicProfile = async () => {
    try {
      // Check if user is authenticated first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("not_authenticated");
        return;
      }

      // Fetch profile by username
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (profileError) {
        if (profileError.code === "PGRST116") {
          setError("not_found");
        } else {
          throw profileError;
        }
        return;
      }

      // Check if the user is viewing their own profile
      const isOwnProfile = user.id === profileData.id;
      
      const isPublic = (profileData as any).is_public;
      
      if (!isOwnProfile && !isPublic) {
        // Only block if profile is private AND not own profile
        setError("private");
        return;
      }

      // Filter sensitive data for public view
      const publicProfile: Profile = {
        ...profileData,
        is_public: !!isPublic,
        email: "", // Hide email
      } as Profile;

      setProfile(publicProfile);
      setIsOwnProfile(isOwnProfile);

      // Fetch stats (same as Profile.tsx)
      const { data: algoData, error: algoError } = await supabase
        .from("user_algorithm_data")
        .select("*")
        .eq("user_id", profileData.id);

      if (algoError) throw algoError;

      const { data: allAlgorithms, error: metaError } = await supabase
        .from("algorithms")
        .select("id, name, difficulty");

      if (metaError) throw metaError;

      // Process Stats
      let easy = 0,
        med = 0,
        hard = 0;
      let heatmapRaw: Record<string, number> = {};
      let recents: any[] = [];
      const activityDates: string[] = [];

      const algoMap = new Map();
      allAlgorithms?.forEach((a) => algoMap.set(a.id, a));

      algoData?.forEach((entry) => {
        if (entry.completed) {
          const algo = algoMap.get(entry.algorithm_id);
          const rawDiff = algo?.difficulty?.toLowerCase() || "";
          const diff = (DIFFICULTY_MAP[rawDiff] || rawDiff).toLowerCase();

          if (diff === "easy") easy++;
          else if (diff === "medium") med++;
          else if (diff === "hard") hard++;
        }

        const subs = (entry.submissions as any[]) || [];
        subs.forEach((s) => {
          const dateKey = format(new Date(s.timestamp), "yyyy-MM-dd");
          heatmapRaw[dateKey] = (heatmapRaw[dateKey] || 0) + 1;
          activityDates.push(dateKey);

          recents.push({
            id: s.id,
            algorithmId: entry.algorithm_id,
            algorithmName:
              algoMap.get(entry.algorithm_id)?.name || entry.algorithm_id,
            status: s.status,
            timestamp: s.timestamp,
            language: s.language,
          });
        });
      });

      // Calculate Streaks
      const { current: currentStreak, max: maxStreak } = calculateStreaks(activityDates);

      let totalEasy = 0,
        totalMed = 0,
        totalHard = 0;
      allAlgorithms?.forEach((a) => {
        const rawDiff = a.difficulty?.toLowerCase() || "";
        const diff = (DIFFICULTY_MAP[rawDiff] || rawDiff).toLowerCase();
        if (diff === "easy") totalEasy++;
        else if (diff === "medium") totalMed++;
        else if (diff === "hard") totalHard++;
      });

      setStats({
        totalSolved: easy + med + hard,
        totalQuestions: allAlgorithms?.length || 0,
        easySolved: easy,
        easyTotal: totalEasy,
        mediumSolved: med,
        mediumTotal: totalMed,
        hardSolved: hard,
        hardTotal: totalHard,
        heatmapData: Object.entries(heatmapRaw).map(([date, count]) => ({
          date,
          count,
        })),
        recentSubmissions: recents
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .slice(0, 20),
        currentStreak,
        longestStreak: maxStreak,
        totalActiveDays: Object.keys(heatmapRaw).length
      });
    } catch (error) {
      console.error("Error fetching public profile:", error);
      setError("not_found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PremiumLoader text="Loading Profile..." />;

  // Error states
  if (error === "not_found") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-xl w-full animate-in fade-in zoom-in duration-500">
          <Card className="flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <CardContent className="pt-12 pb-16 text-center space-y-6 relative">
              {/* Logo */}
              <div className="relative inline-block mb-2">
                <div className="absolute inset-0 blur-2xl rounded-full animate-pulse" />
                  <img 
                    src="/logo.svg" 
                    alt="RulCode" 
                    className="w-14 h-18"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'text-3xl font-bold text-white';
                      fallback.textContent = 'C';
                      e.currentTarget.parentElement?.appendChild(fallback);
                    }}
                  />
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
                  Profile Not Found
                </h1>
                <p className="text-gray-400 text-base">
                  User doesn't exist
                </p>
              </div>

              {/* Message */}
              <div className="border border-primary/20 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <UserX className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground text-left">
                    The user <span className="text-primary font-mono">@{username}</span> doesn't exist or hasn't set up their profile yet.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
                <Button 
                  onClick={() => navigate("/")} 
                  variant="outline"
                  size="lg"
                  className="border-gray-700 hover:border-primary hover:bg-primary/10 min-w-[140px]"
                >
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
              {/* Logo */}
              <div className="relative inline-block mb-2">
                <div className="absolute inset-0 blur-2xl rounded-full animate-pulse" />
                  <img 
                    src="/logo.svg" 
                    alt="RulCode" 
                    className="w-14 h-18"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'text-3xl font-bold text-white';
                      fallback.textContent = 'C';
                      e.currentTarget.parentElement?.appendChild(fallback);
                    }}
                  />
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
                  Private Profile
                </h1>
                <p className="text-gray-400 text-base">
                  This profile is not publicly accessible
                </p>
              </div>

              {/* Message */}
              <div className="border border-primary/20 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground text-left">
                    This profile is set to private and cannot be viewed publicly. Only the profile owner can view their private profile.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
                <Button 
                  onClick={() => navigate("/")} 
                  variant="outline"
                  size="lg"
                  className="border-gray-700 hover:border-primary hover:bg-primary/10 min-w-[140px]"
                >
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
              {/* Logo */}
              <div className="relative inline-block mb-2">
                <div className="absolute inset-0 blur-2xl rounded-full animate-pulse" />
                  <img 
                    src="/logo.svg" 
                    alt="RulCode" 
                    className="w-14 h-18"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'text-3xl font-bold text-white';
                      fallback.textContent = 'C';
                      e.currentTarget.parentElement?.appendChild(fallback);
                    }}
                  />
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-gray-400 text-base">
                  Continue exploring algorithmic journeys
                </p>
              </div>

              {/* Message */}
              <div className="border border-primary/20 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground text-left">
                    Sign in to view detailed profiles, track progress, and connect with the RulCode community.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
                <Button 
                  onClick={() => navigate("/login")} 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 min-w-[140px]"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate("/")} 
                  variant="outline"
                  size="lg"
                  className="border-gray-700 hover:border-primary hover:bg-primary/10 min-w-[140px]"
                >
                  Go Home
                </Button>
              </div>
              
              {/* Sign Up Link */}
              <p className="text-xs text-gray-500 mt-6">
                Don't have an account? <span className="text-primary hover:underline cursor-pointer font-medium" onClick={() => navigate("/login")}>Create one now</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const handleProfileUpdate = () => {
    setIsEditOpen(false);
    fetchPublicProfile(); // Reload profile data
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 pt-24 pb-12 px-4 md:px-8"> 
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Profile Card */}
            <aside className="w-full lg:w-80 shrink-0 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
                <ProfileHeader
                    profile={profile}
                    onEdit={() => setIsEditOpen(true)}
                    isOwnProfile={isOwnProfile}
                />
            </aside>

            {/* Main Content Areas */}
            <div className="flex-1 min-w-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5 hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Total Solved</div>
                        <div className="text-3xl font-bold text-primary">{stats.totalSolved}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            out of {stats.totalQuestions} questions
                        </div>
                    </div>
                     <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5 hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Current Streak</div>
                        <div className="text-3xl font-bold text-orange-500">
                             {stats.currentStreak} <span className="text-sm font-normal text-muted-foreground">days</span>
                        </div>
                         <div className="text-xs text-muted-foreground mt-1 flex justify-between items-center">
                            <span>{stats.currentStreak > 0 ? "Keep it burning!" : "Start a streak today!"}</span>
                        </div>
                    </div>
                     <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5 hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Max Streak</div>
                        <div className="text-3xl font-bold text-amber-500">
                             {stats.longestStreak} <span className="text-sm font-normal text-muted-foreground">days</span>
                        </div>
                         <div className="text-xs text-muted-foreground mt-1">
                            All-time best
                        </div>
                    </div>
                     <div className="bg-card rounded-xl border border-border/40 shadow-sm p-5 hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Total Active Days</div>
                        <div className="text-3xl font-bold text-green-500">
                            {stats.totalActiveDays}
                        </div>
                         <div className="text-xs text-muted-foreground mt-1">
                            Days of coding
                        </div>
                    </div>
                 </div>

                 {/* Activity & Heatmap */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                     {/* Progress by Difficulty - First on mobile, Right on desktop */}
                     <div className="space-y-6 lg:order-last">
                        <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden lg:sticky lg:top-24">
                            <div className="px-5 py-4 border-b border-border/40">
                                <h3 className="font-semibold text-sm">Progress by Difficulty</h3>
                            </div>
                            <div className="p-0">
                                <ProgressStats
                                    totalSolved={stats.totalSolved}
                                    totalQuestions={stats.totalQuestions}
                                    easySolved={stats.easySolved}
                                    easyTotal={stats.easyTotal}
                                    mediumSolved={stats.mediumSolved}
                                    mediumTotal={stats.mediumTotal}
                                    hardSolved={stats.hardSolved}
                                    hardTotal={stats.hardTotal}
                                />
                            </div>
                        </div>
                     </div>

                     {/* Main Feed - Second on mobile, Left on desktop */}
                     <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
                                <h3 className="font-semibold text-sm">Activity Heatmap</h3>
                               
                            </div>
                            <div className="p-4">
                                <SubmissionHeatmap submissions={stats.heatmapData} />
                            </div>
                        </div>

                         <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden">
                             <div className="px-6 py-4 border-b border-border/40">
                                <h3 className="font-semibold text-sm">Recent Submissions</h3>
                            </div>
                            <div className="p-2">
                                <RecentSubmissions submissions={stats.recentSubmissions} />
                            </div>
                        </div>
                     </div>
                 </div>
            </div>
        </div>
      </div>
      
       {/* Edit Dialog */}
       {isOwnProfile && isEditOpen && (
          <EditProfileDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            profile={profile}
            onSave={handleProfileUpdate}
          />
        )}
    </div>
  );
};

export default PublicProfile;
