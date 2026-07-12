'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { SolvedProgressCard } from "@/components/profile/SolvedProgressCard";
import { BadgesPanel } from "@/components/xp/BadgesPanel";
import { SubmissionHeatmap } from "@/components/profile/SubmissionHeatmap";
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

// ── Streak helpers ────────────────────────────────────────────────
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
    let cur = new Date(sortedDates[0] === todayStr ? todayStr : yesterdayStr);
    for (let i = 0; i < sortedDates.length; i++) {
      if (sortedDates.includes(format(cur, "yyyy-MM-dd"))) {
        currentStreak++;
        cur.setDate(cur.getDate() - 1);
      } else break;
    }
  }

  let maxStreak = 0;
  let tempStreak = 1;
  const datesAsc = [...new Set(dates)].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  if (datesAsc.length === 1) maxStreak = 1;
  for (let i = 1; i < datesAsc.length; i++) {
    const diff = Math.ceil(
      Math.abs(new Date(datesAsc[i]).getTime() - new Date(datesAsc[i - 1]).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (diff === 1) tempStreak++;
    else {
      maxStreak = Math.max(maxStreak, tempStreak);
      tempStreak = 1;
    }
  }
  maxStreak = Math.max(maxStreak, tempStreak);

  return { current: currentStreak, max: maxStreak };
};

// ── Types ─────────────────────────────────────────────────────────
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

// ── Error card ────────────────────────────────────────────────────
const ErrorCard = ({
  icon,
  title,
  subtitle,
  message,
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  message: React.ReactNode;
  actions: React.ReactNode;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
    <div className="max-w-xl w-full animate-in fade-in zoom-in duration-500">
      <Card className="flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <CardContent className="pt-12 pb-16 text-center space-y-6 relative">
          <div className="relative inline-block mb-2">
            <img src="/logo.svg" alt="RulCode" className="w-14 h-18" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-primary to-blue-400 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-400 text-base">{subtitle}</p>
          </div>
          <div className="border border-primary/20 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              {icon}
              <p className="text-sm text-muted-foreground text-left">{message}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
            {actions}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────
const PublicProfileClient = ({ username }: PublicProfileClientProps) => {
  const router = useRouter();
  const { user: currentUser, profile: currentUserProfile, refreshProfile } = useApp();
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
  const [error, setError] = useState<"not_found" | "private" | "not_authenticated" | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);
  const [algoData, setAlgoData] = useState<any[]>([]);

  // ── Stats ───────────────────────────────────────────────────────
  const stats = useMemo<ProfileStats>(() => {
    if (!algoData.length || !allAlgorithms.length) {
      return {
        totalSolved: 0, totalQuestions: allAlgorithms.length,
        easySolved: 0, easyTotal: 0,
        mediumSolved: 0, mediumTotal: 0,
        hardSolved: 0, hardTotal: 0,
        heatmapData: [], recentSubmissions: [],
        currentStreak: 0, longestStreak: 0, totalActiveDays: 0,
      };
    }

    let easyCount = 0, medCount = 0, hardCount = 0;
    const heatmapRaw: Record<string, number> = {};
    const recents: any[] = [];
    const activityDates: string[] = [];
    const algoMap = new Map(allAlgorithms.map((a) => [a.id, a]));

    algoData.forEach((entry) => {
      if (entry.completed) {
        const algo = algoMap.get(entry.algorithm_id);
        const diff = (DIFFICULTY_MAP[algo?.difficulty?.toLowerCase() || ""] || algo?.difficulty || "").toLowerCase();
        if (diff === "easy") easyCount++;
        else if (diff === "medium") medCount++;
        else if (diff === "hard") hardCount++;
      }

      ((entry.submissions as any[]) || []).forEach((s) => {
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

    const { current, max } = calculateStreaks(activityDates);

    let totalEasy = 0, totalMed = 0, totalHard = 0;
    allAlgorithms.forEach((a) => {
      const diff = (DIFFICULTY_MAP[a.difficulty?.toLowerCase() || ""] || a.difficulty || "").toLowerCase();
      if (diff === "easy") totalEasy++;
      else if (diff === "medium") totalMed++;
      else if (diff === "hard") totalHard++;
    });

    return {
      totalSolved: easyCount + medCount + hardCount,
      totalQuestions: allAlgorithms.length,
      easySolved: easyCount, easyTotal: totalEasy,
      mediumSolved: medCount, mediumTotal: totalMed,
      hardSolved: hardCount, hardTotal: totalHard,
      heatmapData: Object.entries(heatmapRaw).map(([date, count]) => ({ date, count })),
      recentSubmissions: recents.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
      currentStreak: current,
      longestStreak: max,
      totalActiveDays: Object.keys(heatmapRaw).length,
    };
  }, [algoData, allAlgorithms]);

  // ── Fetch ───────────────────────────────────────────────────────
  useEffect(() => {
    if (username) {
      if (!profile) setLoading(true);
      fetchPublicProfile();
    }
  }, [username, currentUser?.id]);

  const fetchPublicProfile = async () => {
    try {
      setError(null);
      const authUserId =
        currentUser?.id || (await supabase.auth.getUser()).data.user?.id;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, username, full_name, avatar_url, bio, is_public, subscription_status, subscription_tier, location, website_url, github_url, twitter_url, linkedin_url"
        )
        .eq("username", username)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) { setError("not_found"); setLoading(false); return; }

      const isOwn = authUserId === profileData.id;
      const isPublic = (profileData as any).is_public;
      if (!isOwn && !isPublic) { setError("private"); setLoading(false); return; }

      setProfile({ ...profileData, is_public: !!isPublic, email: "" } as Profile);
      setIsOwnProfile(isOwn);

      const { data: userAlgoData, error: algoError } = await supabase
        .from("user_algorithm_data")
        .select("algorithm_id, completed, submissions")
        .eq("user_id", profileData.id);

      if (algoError) throw algoError;
      setAlgoData(userAlgoData || []);
    } catch (err) {
      console.error("Error fetching public profile:", err);
      setError("not_found");
    } finally {
      setLoading(false);
    }
  };

  // ── Render guards ───────────────────────────────────────────────
  if (loading && !profile) return <PremiumLoader text="Loading Profile..." />;

  if (error === "not_found")
    return (
      <ErrorCard
        icon={<UserX className="w-5 h-5 text-primary shrink-0 mt-0.5" />}
        title="Profile Not Found"
        subtitle="User doesn't exist"
        message={<>The user <span className="text-primary font-bold">@{username}</span> doesn&apos;t exist or hasn&apos;t set up their profile yet.</>}
        actions={<Button onClick={() => router.push("/")} variant="outline" size="lg" className="min-w-[140px]">Go Home</Button>}
      />
    );

  if (error === "private")
    return (
      <ErrorCard
        icon={<Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />}
        title="Private Profile"
        subtitle="This profile is not publicly accessible"
        message="This profile is set to private. Only the owner can view it."
        actions={<Button onClick={() => router.push("/")} variant="outline" size="lg" className="min-w-[140px]">Go Home</Button>}
      />
    );

  if (error === "not_authenticated")
    return (
      <ErrorCard
        icon={<Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />}
        title="Welcome Back"
        subtitle="Continue exploring algorithmic journeys"
        message="Sign in to view detailed profiles, track progress, and connect with the community."
        actions={
          <>
            <Button onClick={() => router.push("/login")} size="lg" className="min-w-[140px]">Sign In</Button>
            <Button onClick={() => router.push("/")} variant="outline" size="lg" className="min-w-[140px]">Go Home</Button>
          </>
        }
      />
    );

  if (!profile) return null;

  // ── Main layout ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pt-20 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* ─── LEFT SIDEBAR ─────────────────────────────────── */}
          <aside className="w-full lg:w-[260px] xl:w-[280px] shrink-0">
            <div
              className="lg:sticky lg:top-24 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5"
              style={{ animation: "fadeInLeft 0.5s ease both" }}
            >
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

          {/* ─── MAIN CONTENT ─────────────────────────────────── */}
          <main
            className="flex-1 min-w-0 space-y-5"
            style={{ animation: "fadeInUp 0.5s ease 0.1s both" }}
          >
            {/* ROW 1: Progress + Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Solved Progress (2/3) */}
              <div className="sm:col-span-2 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm">
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

              {/* Badges (1/3) */}
              <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm">
                <BadgesPanel userId={profile.id} />
              </div>
            </div>

            {/* ROW 2: Heatmap */}
            <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 overflow-x-auto">
              <SubmissionHeatmap
                submissions={stats.heatmapData}
                totalActiveDays={stats.totalActiveDays}
                maxStreak={stats.longestStreak}
              />
            </div>

            {/* ROW 3: Recent Submissions */}
            <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Recent Activity</h3>
                {stats.recentSubmissions.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Last {Math.min(visibleCount, stats.recentSubmissions.length)} submissions
                  </span>
                )}
              </div>
              <div className="p-2">
                <RecentSubmissions
                  submissions={stats.recentSubmissions.slice(0, visibleCount)}
                />
                {stats.recentSubmissions.length > visibleCount && (
                  <div className="p-4 flex justify-center border-t border-border/30 mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-primary gap-2"
                      onClick={() => setVisibleCount((p) => p + 15)}
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
          onSave={async (newUsername) => { 
            setIsEditOpen(false); 
            await refreshProfile();
            if (newUsername && newUsername !== username) {
              router.push(`/profile/${newUsername}`);
            } else {
              fetchPublicProfile(); 
            }
          }}
        />
      )}

      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PublicProfileClient;
