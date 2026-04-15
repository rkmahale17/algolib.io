import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { ListType } from "@/types/algorithm";
import { ProblemsList } from "@/components/listing/ProblemsList";
import { Button } from "@/components/ui/button";
import { Rocket, Target, Brain, Layers } from "lucide-react";

const Problems = () => {
  const { data, isLoading } = useAlgorithms();
  const [searchParams, setSearchParams] = useSearchParams();
  const listMode = searchParams.get('mode') || 'all';

  const allAlgorithms = data?.algorithms ?? [];

  const coreAlgorithms = useMemo(() => 
    allAlgorithms.filter(algo => !algo.listType || algo.listType === ListType.Core || algo.listType === ListType.CoreAndBlind75),
    [allAlgorithms]
  );

  const blindAlgorithms = useMemo(() => 
    allAlgorithms.filter(algo => algo.listType === ListType.Blind75 || algo.listType === ListType.CoreAndBlind75),
    [allAlgorithms]
  );

  const algorithmsToShow = useMemo(() => {
    if (listMode === 'core') return coreAlgorithms;
    if (listMode === 'blind') return blindAlgorithms;
    return allAlgorithms;
  }, [listMode, coreAlgorithms, blindAlgorithms, allAlgorithms]);

  const getTitle = () => {
    if (listMode === 'core') return "Core Patterns";
    if (listMode === 'blind') return "Blind 75";
    return "All Practice Questions";
  };

  const getDescription = () => {
    if (listMode === 'core') return "Master the 20% of patterns that solve 80% of interview questions. Focus on high-impact techniques like Sliding Window, Two Pointers, and Backtracking to develop a deep, pattern-based intuition for problem-solving.";
    if (listMode === 'blind') return "The definitive list of 75 essential problems designed to maximize your preparation in minimal time. Focus on the most frequent FAANG interview questions to ensure you're ready for the highest-level technical assessments.";
    return "Explore our comprehensive collection of 150+ problems covering all major data structures and algorithms. Master everything from basic arrays to advanced dynamic programming through hands-on practice and step-by-step visualizations.";
  };

  const getProgressTitle = () => {
    if (listMode === 'core') return "Pattern Progress";
    if (listMode === 'blind') return "Blind 75 Progress";
    return "Overall Progress";
  };

  return (
    <>
      <Helmet>
        <title>{getTitle()} - RulCode | Master Patterns</title>
        <meta name="description" content={getDescription()} />
      </Helmet>

      <ProblemsList
        algorithms={algorithmsToShow}
        title={getTitle()}
        description={getDescription()}
        listType="all"
        progressTitle={getProgressTitle()}
        isLoading={isLoading}
        showRecommendation={listMode === 'all'}
        icon={Layers}
        headerSlot={
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Button
              variant={listMode === 'all' ? 'default' : 'outline'}
              onClick={() => setSearchParams({ mode: 'all' })}
              className="rounded-xl h-10 font-medium transition-all"
            >
              All Questions
            </Button>
            <Button
              variant={listMode === 'core' ? 'default' : 'outline'}
              onClick={() => setSearchParams({ mode: 'core' })}
              className="rounded-xl h-10 font-medium transition-all"
            >
              <Target className="w-4 h-4 mr-2" />
              Core
            </Button>
            <Button
              variant={listMode === 'blind' ? 'default' : 'outline'}
              onClick={() => setSearchParams({ mode: 'blind' })}
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
