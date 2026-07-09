"use client";

import { eachDayOfInterval, format, parseISO } from "date-fns";
import { useMemo } from "react";

import { Card } from "@/components/ui/card";
import { ContributionGraph } from "@/components/listing/ContributionGraph";
import { DashboardHero } from "@/components/listing/DashboardHero";
import { DIFFICULTY_MAP } from "@/types/algorithm";
import { ProblemOfTheDay } from "@/components/listing/ProblemOfTheDay";
import { RecommendedProblems } from "@/components/listing/RecommendedProblems";
import { SolvedProgressCard } from "@/components/profile/SolvedProgressCard";

import { useApp } from "@/contexts/AppContext";
import { useAppSelector } from "@/store/hooks";
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
    let easySolved = 0, easyTotal = 0;
    let mediumSolved = 0, mediumTotal = 0;
    let hardSolved = 0, hardTotal = 0;

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
      easySolved, easyTotal,
      mediumSolved, mediumTotal,
      hardSolved, hardTotal,
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
    const sortedDates = [...submissionsData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    if (sortedDates.length === 0) return { currentStreak: 0, maxStreak: 0 };
    const submissionMap = new Map(sortedDates.map((s) => [s.date, s.count]));
    const firstDate = parseISO(sortedDates[0].date);
    const today = new Date();
    const days = eachDayOfInterval({ start: firstDate, end: today });
    let streak = 0;
    let max = 0;
    days.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      if (submissionMap.get(dateStr)) {
        streak++;
        max = Math.max(max, streak);
      } else {
        streak = 0;
      }
    });
    return { currentStreak: streak, maxStreak: max };
  }, [submissionsData]);

  const continueLearningAlgo = useMemo(() => {
    if (!userProgressData || userProgressData.length === 0) return null;
    const sorted = [...userProgressData].sort((a, b) => {
      const timeA = new Date(a.last_viewed_at || a.updated_at).getTime();
      const timeB = new Date(b.last_viewed_at || b.updated_at).getTime();
      return timeB - timeA;
    });
    const incomplete = sorted.find((p) => !p.completed);
    const target = incomplete || sorted[0];
    if (!target) return null;
    const algo = algorithms.find((a) => a.id === target.algorithm_id);
    if (!algo) return null;
    return { algorithm: algo, progress: target };
  }, [userProgressData, algorithms]);

  // Compute next milestone for hero
  const getNextMilestone = (solved: number) => {
    if (solved < 5) return 5;
    if (solved < 10) return 10;
    if (solved < 25) return 25;
    if (solved < 50) return 50;
    if (solved < 100) return 100;
    return Math.ceil((solved + 1) / 50) * 50;
  };
  const nextMilestone = getNextMilestone(overallStats.totalSolved);

  if (isAlgosLoading || algorithms.length === 0) {
    return null;
  }

  const isPOTDUnsolved =
    potd?.problem && progressMap?.[potd.problem.id] !== "solved";

  return (
    <div className="w-full max-w-[820px] mx-auto space-y-4 mb-8 mt-2 px-2 sm:px-0">
      {/* ① Personalized Hero */}
      <DashboardHero
        currentStreak={currentStreak}
        nextMilestone={nextMilestone}
        totalSolved={overallStats.totalSolved}
        submissionsData={submissionsData}
      />



      {/* ③ Progress + Contribution Graph — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4 w-full items-stretch">
        {/* Progress panel */}
        <div className="min-w-0 flex flex-col h-full">
          <Card className="bg-card border-border/40 shadow-sm overflow-hidden flex flex-col h-full rounded-xl">
            <div className="px-4 py-2.5 border-b border-border/40 shrink-0 bg-muted/20">
              <h3 className="font-semibold text-[13px] text-foreground/80">📈 Learning Progress</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <SolvedProgressCard
                {...overallStats}
                compact
                currentStreak={currentStreak}
                maxStreak={maxStreak}
                userId={user?.id}
              />
            </div>
          </Card>
        </div>

        {/* Contribution graph */}
        <div className="w-full lg:w-[240px] flex-none shrink-0 h-full">
          <ContributionGraph submissions={submissionsData} weeks={10} currentStreak={currentStreak} maxStreak={maxStreak} />
        </div>
      </div>

      {/* ④ Recommended Problems */}
      <RecommendedProblems algorithms={algorithms} />



      {/* ⑤ Daily Challenge */}
      {isPOTDUnsolved && (
        <div className="w-full">
          <ProblemOfTheDay potd={potd} progressMap={progressMap} />
        </div>
      )}


    </div>
  );
};
