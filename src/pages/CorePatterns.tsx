"use client";
import { useMemo } from 'react';
import Head from 'next/head';
import { ListType } from "@/types/algorithm";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { ProblemsList } from "@/components/listing/ProblemsList";
import { Target } from "lucide-react";

const CorePatterns = () => {
  const { data, isLoading } = useAlgorithms();

  const allAlgorithms = data?.algorithms ?? [];
  const coreAlgorithms = useMemo(() =>
    allAlgorithms.filter(algo => !algo.listType || algo.listType === ListType.Core || algo.listType === ListType.CoreAndBlind75),
    [allAlgorithms]
  );

  return (
    <>
      <Head>
        <title>Core Patterns - Master the Fundamentals | Rulcode.com</title>
      </Head>

      <ProblemsList
        algorithms={coreAlgorithms}
        title="Core Patterns Library"
        description="Master the 20% of patterns that solve 80% of interview questions. Focus on high-impact techniques like Sliding Window, Two Pointers, and Backtracking to develop a deep, pattern-based intuition for problem-solving."
        listType="core"
        progressTitle="Pattern Mastery Progress"
        isLoading={isLoading}
        showRecommendation={true}
        icon={Target}
      />
    </>
  );
};

export default CorePatterns;
