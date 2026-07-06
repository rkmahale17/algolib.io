"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { SolvedProgressCard } from "@/components/profile/SolvedProgressCard";
import { BadgesCard } from "@/components/profile/BadgesCard";
import { SubmissionHeatmap } from "@/components/profile/SubmissionHeatmap";
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

  const sortedDates = [...new Set(dates)].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = format(today, "yyyy-MM-dd");
  const yesterdayStr = format(yesterday, "yyyy-MM-dd");

  let currentStreak = 0;
  if (sortedDates.includes(todayStr) || sortedDates.includes(yesterdayStr)) {
    let currentDate = new Date(
      sortedDates[0] === todayStr ? todayStr : yesterdayStr
    );
    for (let i = 0; i < sortedDates.length; i++) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      if (sortedDates.includes(dateStr)) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  let maxStreak = 0;
  let tempStreak = 1;
  const datesAsc = [...new Set(dates)].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  if (datesAsc.length === 1) maxStreak = 1;
  for (let i = 1; i < datesAsc.length; i++) {
    const prev = new Date(datesAsc[i - 1]);
    const curr = new Date(datesAsc[i]);
    const diffDays = Math.ceil(
      Math.abs(curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
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
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string | undefined;
  const { user: currentUser, profile: currentUserProfile } = useApp();
  const { data: algoMeta } = useAlgorithms();
  const isUserAdmin = currentUserProfile?.role === "admin";
  const allAlgorithms = useMemo(
    () =>
      (algoMeta?.algorithms || []).filter(
        (algo) => algo.published !== false || isUserAdmin
      ),
    [algoMeta, isUserAdmin]
  );

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<
    "not_found" | "private" | "not_authenticated" | null
  >(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [visibleSubmissionsTotal, setVisibleSubmissionsTotal] = useState(15);
  const [algoData, setAlgoData] = useState<any[]>([]);

  useProfileSEO(profile);

  const stats = useMemo<ProfileStats>(() => {
    if (!algoData || !allAlgorithms) {
      return {
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
        totalActiveDays: 0,
      };
    }

    let easyCount = 0,
      medCount = 0,
      hardCount = 0;
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
          algorithmName:
            algoMap.get(entry.algorithm_id)?.name || entry.algorithm_id,
          status: s.status,
          timestamp: s.timestamp,
          language: s.language,
        });
      });
    });

    const { current: currentStreak, max: maxStreak } =
      calculateStreaks(activityDates);

    let totalEasy = 0,
      totalMed = 0,
      totalHard = 0;
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
      heatmapData: Object.entries(heatmapRaw).map(([date, count]) => ({
        date,
        count,
      })),
      recentSubmissions: recents.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
      currentStreak,
      longestStreak: maxStreak,
      totalActiveDays: Object.keys(heatmapRaw).length,
    };
  }, [algoData, allAlgorithms]);

  useEffect(() => {
    if (!username) {
      router.push("/");
      return;
    }
    fetchPublicProfile();
  }, [username]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentUser) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("not_authenticated");
          return;
        }
      }

      const authUserId =
        currentUser?.id ||
        (await supabase.auth.getUser()).data.user?.id;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, username, full_name, avatar_url, bio, is_public, subscription_status, subscription_tier, location, website_url, github_url, twitter_url, linkedin_url"
        )
        .eq("username", username as string)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) {
        setError("not_found");
        return;
      }

      // @ts-ignore
      const isOwn = authUserId === profileData.id;
      // @ts-ignore
      const isPublic = (profileData as any).is_public;
      if (!isOwn && !isPublic) {
        setError("private");
        return;
      }

      const publicProfile: Profile = {
        // @ts-ignore
        ...profileData,
        is_public: !!isPublic,
        email: "",
      } as Profile;

      setProfile(publicProfile);
      setIsOwnProfile(isOwn);

      const { data: userAlgoData, error: algoError } = await supabase
        .from("user_algorithm_data")
        .select("algorithm_id, completed, submissions")
        // @ts-ignore
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

  // ── Error states ──────────────────────────────────────────
  const errorConfig = {
    not_found: {
      icon: <UserX className="w-5 h-5 text-primary shrink-0 mt-0.5" />,
      title: "Profile Not Found",
      subtitle: "User doesn't exist",
      message: (
        <>
          The user{" "}
          <span className="text-primary font-bold">@{username}</span>{" "}
          doesn&apos;t exist or hasn&apos;t set up their profile yet.
        </>
      ),
    },
    private: {
      icon: <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />,
      title: "Private Profile",
      subtitle: "This profile is not publicly accessible",
      message:
        "This profile is set to private. Only the owner can view it.",
    },
    not_authenticated: {
      icon: <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />,
      title: "Welcome Back",
      subtitle: "Continue exploring algorithmic journeys",
      message:
        "Sign in to view detailed profiles, track progress, and connect with the community.",
    },
  };

  if (error && error in errorConfig) {
    const cfg = errorConfig[error as keyof typeof errorConfig];
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-primary to-blue-400 bg-clip-text text-transparent">
                  {cfg.title}
                </h1>
                <p className="text-gray-400 text-base">{cfg.subtitle}</p>
              </div>
              <div className="border border-primary/20 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  {cfg.icon}
                  <p className="text-sm text-muted-foreground text-left">
                    {cfg.message}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
                {error === "not_authenticated" && (
                  <Button
                    onClick={() => router.push("/login")}
                    size="lg"
                    className="min-w-[140px]"
                  >
                    Sign In
                  </Button>
                )}
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  size="lg"
                  className="min-w-[140px]"
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

  if (!profile) return null;

  // ── Main Layout ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pt-20 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="w-full lg:w-[260px] xl:w-[280px] shrink-0">
            <div className="lg:sticky lg:top-24 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 animate-in fade-in slide-in-from-left-4 duration-700">
              <ProfileSidebar
                profile={profile}
                onEdit={() => setIsEditOpen(true)}
                isOwnProfile={isOwnProfile}
                currentStreak={stats.currentStreak}
                longestStreak={stats.longestStreak}
                totalActiveDays={stats.totalActiveDays}
              />
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">

            {/* ── ROW 1: Solved Progress + Badges ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Progress Card (2/3 width) */}
              <div className="sm:col-span-2 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
                <SolvedProgressCard
                  totalSolved={stats.totalSolved}
                  totalQuestions={stats.totalQuestions}
                  easySolved={stats.easySolved}
                  easyTotal={stats.easyTotal}
                  mediumSolved={stats.mediumSolved}
                  mediumTotal={stats.mediumTotal}
                  hardSolved={stats.hardSolved}
                  hardTotal={stats.hardTotal}
                  userId={profile.id}
                />
              </div>

              {/* Badges Card (1/3 width) */}
              <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
                <BadgesCard badges={[]} />
              </div>
            </div>

            {/* ── ROW 2: Activity Heatmap ── */}
            <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 overflow-hidden">
              <SubmissionHeatmap
                submissions={stats.heatmapData}
                totalActiveDays={stats.totalActiveDays}
                maxStreak={stats.longestStreak}
              />
            </div>

            {/* ── ROW 3: Recent Submissions ── */}
            <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Recent Submissions</h3>
                {stats.recentSubmissions.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {stats.recentSubmissions.length} total
                  </span>
                )}
              </div>
              <div className="p-2">
                <RecentSubmissions
                  submissions={stats.recentSubmissions.slice(
                    0,
                    visibleSubmissionsTotal
                  )}
                />
                {stats.recentSubmissions.length > visibleSubmissionsTotal && (
                  <div className="p-4 flex justify-center border-t border-border/30 mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-primary gap-2"
                      onClick={() =>
                        setVisibleSubmissionsTotal((prev) => prev + 15)
                      }
                    >
                      <ChevronDown className="w-3 h-3" />
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

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
