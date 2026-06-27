"use client";

import { Flame, Trophy } from "lucide-react";
import { eachDayOfInterval, format, parseISO } from "date-fns";

import { Card } from "@/components/ui/card";
import { ContinueLearningCard } from "@/components/listing/ContinueLearningCard";
import { DIFFICULTY_MAP } from "@/types/algorithm";
import { ProblemOfTheDay } from "@/components/listing/ProblemOfTheDay";
import { RecommendedProblems } from "@/components/listing/RecommendedProblems";
import { SolvedProgressCard } from "@/components/profile/SolvedProgressCard";
import { StreakCalendar } from "@/components/profile/StreakCalendar";
import { useApp } from "@/contexts/AppContext";
import { useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
import { useProblemOfTheDay } from "@/hooks/useProblemOfTheDay";

export const DashboardWidgets = () => {
  const { user } = useApp();
  const { items: algorithms, isLoading: isAlgosLoading } = useAppSelector(
    (state) => state.algorithms,
  );
  const {
    data: userProgressData,
    progressMap,
    isLoading: isProgressLoading,
  } = useAppSelector((state) => state.userProgress);

  const potd = useProblemOfTheDay(algorithms);

  const overallStats = useMemo(() => {
    let easySolved = 0,
      easyTotal = 0;
    let mediumSolved = 0,
      mediumTotal = 0;
    let hardSolved = 0,
      hardTotal = 0;

    algorithms.forEach((algo) => {
      const rawDiff = algo.difficulty?.toLowerCase() || "";
      const diff = (DIFFICULTY_MAP[rawDiff] || rawDiff).toLowerCase();
      const isSolved = progressMap?.[algo.id] === "solved";

      if (diff === "easy") {
        easyTotal++;
        if (isSolved) easySolved++;
      } else if (diff === "hard") {
        hardTotal++;
        if (isSolved) hardSolved++;
      } else {
        mediumTotal++;
        if (isSolved) mediumSolved++;
      }
    });

    return {
      totalSolved: easySolved + mediumSolved + hardSolved,
      totalQuestions: algorithms.length,
      easySolved,
      easyTotal,
      mediumSolved,
      mediumTotal,
      hardSolved,
      hardTotal,
    };
  }, [algorithms, progressMap]);

  const submissionsData = useMemo(() => {
    const map = new Map<string, any[]>();
    userProgressData.forEach((item) => {
      if (item.submissions && Array.isArray(item.submissions)) {
        item.submissions.forEach((sub: any) => {
          if (sub.timestamp) {
            const date = new Date(sub.timestamp).toISOString().split("T")[0];
            const current = map.get(date) || [];
            const algo = algorithms.find((a) => a.id === item.algorithm_id);
            current.push({
              ...sub,
              algorithm_id: item.algorithm_id,
              algorithm_title: algo?.title || "Unknown Problem",
              difficulty: algo?.difficulty || "EASY",
            });
            map.set(date, current);
          }
        });
      }
    });
    return Array.from(map.entries()).map(([date, list]) => ({
      date,
      count: list.length,
      activities: list,
    }));
  }, [userProgressData, algorithms]);

  const { currentStreak, maxStreak } = useMemo(() => {
    let current = 0;
    let max = 0;
    const sortedDates = [...submissionsData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    if (sortedDates.length === 0) return { currentStreak: 0, maxStreak: 0 };
    const submissionMap = new Map(sortedDates.map((s) => [s.date, s.count]));
    const firstDate = parseISO(sortedDates[0].date);
    const today = new Date();
    const days = eachDayOfInterval({ start: firstDate, end: today });
    let streak = 0;
    days.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      if (submissionMap.get(dateStr)) {
        streak++;
        max = Math.max(max, streak);
      } else {
        streak = 0;
      }
    });
    current = streak;
    return { currentStreak: current, maxStreak: max };
  }, [submissionsData]);

  const continueLearningAlgo = useMemo(() => {
    if (!userProgressData || userProgressData.length === 0) return null;

    // Sort progress data by last_viewed_at or updated_at (descending)
    const sorted = [...userProgressData].sort((a, b) => {
      const timeA = new Date(a.last_viewed_at || a.updated_at).getTime();
      const timeB = new Date(b.last_viewed_at || b.updated_at).getTime();
      return timeB - timeA;
    });

    // Find the most recent incomplete algorithm first
    const incomplete = sorted.find((p) => !p.completed);
    const target = incomplete || sorted[0];

    if (!target) return null;

    // Find the actual algorithm object
    const algo = algorithms.find((a) => a.id === target.algorithm_id);
    if (!algo) return null;

    return {
      algorithm: algo,
      progress: target,
    };
  }, [userProgressData, algorithms]);

  // Only display if user is logged in, and data has loaded
  if (isAlgosLoading || algorithms.length === 0) {
    return null;
  }

  const isPOTDUnsolved =
    potd?.problem && progressMap?.[potd.problem.id] !== "solved";

  return (
    <div className="w-full max-w-[820px] mx-auto space-y-6 mb-8 mt-2 px-2 sm:px-0">
      {/* Progress & Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 w-full items-stretch">
        {/* Progress Card */}
        <div className="min-w-0 flex flex-col h-full">
          <Card className="bg-card border-border/40 shadow-sm overflow-hidden flex flex-col h-full rounded-xl">
            <div className="px-4 py-3 border-b border-border/40 shrink-0 bg-muted/20">
              <h3 className="font-normal text-[13px] text-foreground/80">
                Overall Progress
              </h3>
            </div>
            <div className="flex-1 flex flex-col justify-center py-2">
              <SolvedProgressCard {...overallStats} compact />
            </div>
            {/* Streaks */}
            <div className="border-t border-border/30 px-4 py-3.5 bg-muted/5 flex items-center justify-around divide-x divide-border/30 gap-2 shrink-0">
              <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0">
                <span className="text-[11px] sm:text-[12px] text-muted-foreground font-normal mb-1 truncate">
                  Current Streak
                </span>
                <div className="flex items-center justify-center gap-1.5">
                  <Flame className="w-4.5 h-4.5 text-foreground shrink-0" />
                  <span className="text-md sm:text-lg font-normal text-foreground tracking-tight truncate">
                    {currentStreak}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground/80 font-normal pb-0.5">
                    days
                  </span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0">
                <span className="text-[11px] sm:text-[12px] text-muted-foreground font-normal mb-1 truncate">
                  Best Streak
                </span>
                <div className="flex items-center justify-center gap-1.5">
                  <Trophy className="w-4.5 h-4.5 text-foreground shrink-0" />
                  <span className="text-md sm:text-lg font-normal text-foreground tracking-tight truncate">
                    {maxStreak}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground/80 font-normal pb-0.5">
                    days
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Streak Calendar */}
        <div className="w-full max-w-[320px] mx-auto lg:mx-0 flex-none shrink-0 h-full">
          <StreakCalendar submissions={submissionsData} />
        </div>
      </div>
      {/* Continue Learning & Recommended Problems */}
      <div className="space-y-4 w-full">
        {continueLearningAlgo && (
          <ContinueLearningCard
            algorithm={continueLearningAlgo.algorithm}
            progress={continueLearningAlgo.progress}
          />
        )}
        <RecommendedProblems algorithms={algorithms} />
      </div>
      {/* Daily Challenge (POTD) Card */}
      {isPOTDUnsolved && (
        <div className="w-full">
          <ProblemOfTheDay potd={potd} progressMap={progressMap} />
        </div>
      )}
    </div>
  );
};
