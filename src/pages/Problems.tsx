"use client";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from 'next/head';
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { ListType } from "@/types/algorithm";
import { ProblemsList } from "@/components/listing/ProblemsList";
import { Button } from "@/components/ui/button";
import { Rocket, Target, Brain, Layers } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

const Problems = () => {
  const { setOpenMobile, toggleSidebar, state } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading } = useAlgorithms();

  const listMode = searchParams.get('mode') || 'all';
  const topicFilter = searchParams.get('topic') || undefined;
  const companyFilter = searchParams.get('company') || undefined;

  const allAlgorithms = data?.algorithms ?? [];

  const coreAlgorithms = useMemo(() =>
    allAlgorithms.filter(algo => !algo.listType || algo.listType === ListType.Core || algo.listType === ListType.CoreAndBlind75),
    [allAlgorithms]
  );

  const blindAlgorithms = useMemo(() =>
    allAlgorithms.filter(algo => algo.listType === ListType.Blind75 || algo.listType === ListType.CoreAndBlind75),
    [allAlgorithms]
  );

  const filteredAlgorithms = useMemo(() => {
    let result = allAlgorithms;
    if (listMode === 'core') result = coreAlgorithms;
    else if (listMode === 'blind') result = blindAlgorithms;

    if (topicFilter) {
      result = result.filter(algo => {
        const category = algo.category?.toLowerCase() || '';
        return category.includes(topicFilter.toLowerCase());
      });
    }

    if (companyFilter) {
      result = result.filter(algo => {
        const companies = algo.metadata?.companies || [];
        return companies.some((c: string) => c.toLowerCase() === companyFilter.toLowerCase());
      });
    }

    return result;
  }, [listMode, coreAlgorithms, blindAlgorithms, allAlgorithms, topicFilter, companyFilter]);

  const getTitle = () => {
    if (topicFilter) return `${topicFilter} Problems`;
    if (companyFilter) return `${companyFilter} Interview Questions`;
    if (listMode === 'core') return "Core Patterns";
    if (listMode === 'blind') return "Blind 75";
    return "All Practice Questions";
  };

  const getDescription = () => {
    if (topicFilter) return `Master ${topicFilter} through our curated list of high-impact problems. Each challenge is selected to build your intuition and problem-solving skills in this core category.`;
    if (companyFilter) return `Prepare for your ${companyFilter} interview with these frequency-based problems. Practice the patterns and algorithms commonly asked in their technical assessments.`;
    if (listMode === 'core') return "Master the 20% of patterns that solve 80% of interview questions. Focus on high-impact techniques like Sliding Window, Two Pointers, and Backtracking to develop a deep, pattern-based intuition for problem-solving.";
    if (listMode === 'blind') return "The definitive list of 75 essential problems designed to maximize your preparation in minimal time. Focus on the most frequent FAANG interview questions to ensure you're ready for the highest-level technical assessments.";
    return "Explore our comprehensive collection of 150+ problems covering all major data structures and algorithms. Master everything from basic arrays to advanced dynamic programming through hands-on practice and step-by-step visualizations.";
  };

  const getProgressTitle = () => {
    if (topicFilter) return `${topicFilter} Progress`;
    if (companyFilter) return `${companyFilter} Prep Progress`;
    if (listMode === 'core') return "Pattern Progress";
    if (listMode === 'blind') return "Blind 75 Progress";
    return "Overall Progress";
  };

  return (
    <>
      <Head>
        <title>{getTitle()} - RulCode | Master Patterns</title>
        <meta name="description" content={getDescription()} />
      </Head>

      <ProblemsList
        algorithms={filteredAlgorithms}
        title={getTitle()}
        description={getDescription()}
        listType="all"
        progressTitle={getProgressTitle()}
        isLoading={isLoading}
        showRecommendation={listMode === 'all' && !topicFilter && !companyFilter}
        icon={Layers}
        initialSelectedTopics={topicFilter ? [topicFilter] : []}
        initialSelectedCompanies={companyFilter ? [companyFilter] : []}
        headerSlot={
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Button
              variant={listMode === 'all' ? 'default' : 'outline'}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('mode', 'all');
                router.push(`/dsa/problems?${params.toString()}`);
              }}
              className="rounded-xl h-10 font-medium transition-all"
            >
              All Questions
            </Button>
            <Button
              variant={listMode === 'core' ? 'default' : 'outline'}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('mode', 'core');
                router.push(`/dsa/problems?${params.toString()}`);
              }}
              className="rounded-xl h-10 font-medium transition-all"
            >
              <Target className="w-4 h-4 mr-2" />
              Core
            </Button>
            <Button
              variant={listMode === 'blind' ? 'default' : 'outline'}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('mode', 'blind');
                router.push(`/dsa/problems?${params.toString()}`);
              }}
              className="rounded-xl h-10 font-medium transition-all"
            >
              <Brain className="w-4 h-4 mr-2" />
              Blind
            </Button>
          </div>
        }
      />
    </>
  );
};

export default Problems;
