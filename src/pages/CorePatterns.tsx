import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
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
      <Helmet>
        <title>Core Patterns - Master the Fundamentals | Rulcode.com</title>
      </Helmet>

      <ProblemsList
        algorithms={coreAlgorithms}
        title="Core Patterns Library"
        description="Step-by-step visualizations of essential patterns. Build a rock-solid foundation for interviews and software engineering."
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
