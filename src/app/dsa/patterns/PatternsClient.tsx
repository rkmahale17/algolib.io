'use client';

import { useMemo } from "react";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { ProblemsList } from "@/components/listing/ProblemsList";
import { Code2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const PatternsClient = () => {
  const { data, isLoading } = useAlgorithms();
  const { profile } = useApp();

  const isUserAdmin = profile?.role === 'admin';

  const allAlgorithms = useMemo(() => 
    (data?.algorithms ?? [])
      .filter(algo => algo.problemType === 'dsa')
      .filter(algo => algo.published !== false || isUserAdmin),
    [data, isUserAdmin]
  );

  return (
    <ProblemsList
      algorithms={allAlgorithms}
      title="Pattern Practice"
      description="Browse and practice problems by specific topics and patterns. Category-wise grouping helps you to know when and how to use specific techniques."
      listType="all"
      isLoading={isLoading}
      showRecommendation={false}
      initialCategoryWise={true}
      icon={Code2}
    />
  );
};

export default PatternsClient;
